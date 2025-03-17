import { Request, Response } from 'express';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestService } from '../services/request-service.js';

export class RequestController {
  private readonly requestService: RequestService;

  constructor() {
    this.requestService = new RequestService();
    this.createRequest = this.createRequest.bind(this);
    this.getRequests = this.getRequests.bind(this);
    this.getRequestById = this.getRequestById.bind(this);
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  public async createRequest(request: Request, response: Response): Promise<void> {
    try {
      const requestData = RequestEntity.from({
        ...request.body,
        headers: request.body.headers || {},
        protocol: request.body.protocol || 'HTTP',
        responseStatus: 0,
        createdAt: new Date(),
      });

      const executedRequest = await this.requestService.executeApiRequest(requestData);
      await this.requestService.saveApiRequest(executedRequest);

      response.status(201).json(executedRequest);
    } catch (error: any) {
      console.error('Error executing API request:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getRequests(_request: Request, response: Response): Promise<void> {
    try {
      const savedRequests = await this.requestService.getSavedRequests();
      response.status(200).json(savedRequests.map((req) => req.toJSON()));
    } catch (error: any) {
      console.error('Error fetching requests:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getRequestById(request: Request, response: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const requestId = parseInt(request.params.id);

      const savedRequests = await this.requestService.getSavedRequests();
      const savedRequest = savedRequests.find((r) => r.id === requestId);

      if (!savedRequest) {
        return response.status(404).json({ error: 'Request not found' });
      }

      return response.status(200).json(savedRequest.toJSON());
    } catch (error: any) {
      console.error('Error fetching request:', error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  public async deleteRequest(request: Request, response: Response) {
    try {
      const requestId = parseInt(request.params.id);

      await this.requestService.deleteSavedRequest(requestId);

      return response.status(200).json({ message: 'Request deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting request:', error.message);
      return response.status(500).json({ error: error.message });
    }
  }
}
