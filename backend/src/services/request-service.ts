import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestRepository } from '../db/request-repository.js';
import logger from './log-service.js';

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

      logger.error('Unexpected error', error as Error);
      throw new Error((error as Error).message);
    }
  }

  public async saveApiRequest(request: RequestEntity): Promise<void> {
    await this.requestRepo.saveRequest(request);
  }

  public async getSavedRequests(limit: number, offset: number): Promise<RequestEntity[]> {
    const requests = await this.requestRepo.getRequests(limit, offset);

    return requests.map((req) => {
      const clonedRequest = new RequestEntity({ ...req });
      return clonedRequest;
    });
  }

  public async getSavedRequestById(id: number): Promise<RequestEntity> {
    return await this.requestRepo.getRequestById(id);
  }

  public async deleteSavedRequest(id: number): Promise<void> {
    await this.requestRepo.deleteRequest(id);
  }

  public async getRequestsCount(): Promise<number> {
    return await this.requestRepo.getRequestCount();
  }

  private finalizeRequestWithResponse(request: RequestEntity, response: AxiosResponse): RequestEntity {
    const responseData = response.data;

    return new RequestEntity({
      ...request,
      responseStatus: response.status,
      responseBody: responseData,
      responseHeaders: response.headers as Record<string, any>,
    });
  }
}
