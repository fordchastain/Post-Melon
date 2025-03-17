import { Request, Response } from 'express';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestService } from '../services/request-service.js';
import logger from '../services/log-service.js';

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
      logger.error('Error executing API request:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getRequests(request: Request, response: Response): Promise<void> {
    try {
      const limit = parseInt(request.params.limit);
      const offset = parseInt(request.params.offset);

      const savedRequests = await this.requestService.getSavedRequests(limit, offset);
      response.status(200).json(savedRequests.map((req) => req.toJSON()));
    } catch (error: any) {
      logger.error('Error fetching requests:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getRequestById(request: Request, response: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const requestId = parseInt(request.params.id);
      const savedRequest = await this.requestService.getSavedRequestById(requestId);

      if (!savedRequest) {
        return response.status(404).json({ error: 'Request not found' });
      }

      return response.status(200).json(savedRequest.toJSON());
    } catch (error: any) {
      logger.error('Error fetching request:', error.message);
      return response.status(500).json({ error: error.message });
    }
  }

  public async deleteRequest(request: Request, response: Response) {
    try {
      const requestId = parseInt(request.params.id);

      await this.requestService.deleteSavedRequest(requestId);

      return response.status(200).json({ message: 'Request deleted successfully' });
    } catch (error: any) {
      logger.error('Error deleting request:', error.message);
      return response.status(500).json({ error: error.message });
    }
  }
}
