import axios, { Axios, AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestRepository } from '../db/request-repository.js';
import { encrypt, decrypt } from './encryption-service.js';

const requestRepo = new RequestRepository();

export const RequestService = {
  async executeApiRequest(request: RequestEntity) {
    try {
      const parsedHeaders = typeof request.headers === 'string' ? JSON.parse(request.headers) : request.headers;

      const axiosResponse = await axios({
        method: request.method,
        url: request.url,
        headers: parsedHeaders,
        data: request.body,
      });

      return this.finalizeRequestWithResponse(request, axiosResponse);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return this.finalizeRequestWithResponse(request, error.response);
        }

        const fallbackResponse: AxiosResponse = {
          data: {error: error.message },
          status: -1,
          headers: {},
          statusText: 'No Response',
          config: { headers: {} as AxiosRequestHeaders }
        };

        return this.finalizeRequestWithResponse(request, fallbackResponse);
      } else {
        console.log('Unexpected error', error.message);
        throw new Error(error.message);
      }
    }
  },

  async saveApiRequest(request: RequestEntity) {
    const clonedRequest = new RequestEntity({ ...request });

    if (clonedRequest.encrypted) {
      clonedRequest.body = encrypt(clonedRequest.body);
    }

    await requestRepo.saveRequest(clonedRequest);
  },

  async getSavedRequests(): Promise<RequestEntity[]> {
    const requests = await requestRepo.getRequests();

    return requests.map((req) => {
      const clonedRequest = new RequestEntity({ ...req });

      if (clonedRequest.encrypted) {
        clonedRequest.body = decrypt(clonedRequest.body);
      }

      return clonedRequest;
    });
  },

  async deleteSavedRequest(id: number) {
    await requestRepo.deleteRequest(id);
  },

  async updateRequest(request: RequestEntity) {
    await requestRepo.updateRequest(request);
  },

  parseAxiosHeaders(headers: any): Record<string, string> {
    if (!headers) {
      return {};
    }

    if (typeof headers.toJSON === 'function') {
      return headers.toJSON();
    }

    const normalized: Record<string, string> = {};

    for (const key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        const value = headers[key];

        if (Array.isArray(value)) {
          normalized[key] = value.join(', ');
        } else if (typeof value === 'undefined') {
          normalized[key] = '';
        } else {
          normalized[key] = String(value);
        }
      }
    }

    return normalized;
  },

  finalizeRequestWithResponse(request: RequestEntity, response: AxiosResponse) {
    let responseData = response.data;

    if (request.encrypted) {
      responseData = encrypt(JSON.stringify(response.data));
    }

    return {
      ...request,
      responseStatus: response.status,
      responseBody: responseData,
      responseHeaders: response.headers as Record<any, any>
    } as RequestEntity;
  }
};
