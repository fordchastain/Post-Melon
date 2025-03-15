import axios from 'axios';
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

      let responseData = axiosResponse.data;

      if (request.encrypted) {
        responseData = encrypt(JSON.stringify(responseData));
      }

      return {
        status: axiosResponse.status,
        headers: axiosResponse.headers,
        data: responseData,
      };
    } catch (error: any) {
      if (error.response) {
        let responseData = error.response.data;

        if (request.encrypted) {
          responseData = encrypt(JSON.stringify(responseData));
        }

        return {
          status: responseData.status,
          headers: responseData.headers,
          data: responseData,
        };
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
};
