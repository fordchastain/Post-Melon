import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestRepository } from '../db/request-repository.js';
import { encrypt, decrypt } from './encryption-service.js';

export class RequestService {
  private requestRepo = new RequestRepository();

  public async executeApiRequest(request: RequestEntity): Promise<RequestEntity> {
    try {
      const axiosResponse = await axios({
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.body,
      });

      return this.finalizeRequestWithResponse(request, axiosResponse);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return this.finalizeRequestWithResponse(request, error.response);
        }

        const fallbackResponse: AxiosResponse = {
          data: { error: error.message },
          status: -1,
          headers: {},
          statusText: 'No Response',
          config: { headers: {} as AxiosRequestHeaders },
        };

        return this.finalizeRequestWithResponse(request, fallbackResponse);
      }

      console.error('Unexpected error', (error as Error).message);
      throw new Error((error as Error).message);
    }
  }

  public async saveApiRequest(request: RequestEntity): Promise<void> {
    const clonedRequest = new RequestEntity({ ...request });

    if (clonedRequest.encrypted) {
      clonedRequest.body = encrypt(clonedRequest.body);
    }

    await this.requestRepo.saveRequest(clonedRequest);
  }

  public async getSavedRequests(): Promise<RequestEntity[]> {
    const requests = await this.requestRepo.getRequests();

    return requests.map((req) => {
      const clonedRequest = new RequestEntity({ ...req });

      if (clonedRequest.encrypted) {
        clonedRequest.body = decrypt(clonedRequest.body);
      }

      return clonedRequest;
    });
  }

  public async deleteSavedRequest(id: number): Promise<void> {
    await this.requestRepo.deleteRequest(id);
  }

  private finalizeRequestWithResponse(request: RequestEntity, response: AxiosResponse): RequestEntity {
    let responseData = response.data;

    if (request.encrypted) {
      responseData = encrypt(JSON.stringify(response.data));
    }

    return new RequestEntity({
      ...request,
      responseStatus: response.status,
      responseBody: responseData,
      responseHeaders: response.headers as Record<string, any>,
    });
  }
}
