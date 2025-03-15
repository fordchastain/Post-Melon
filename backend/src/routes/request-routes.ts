import { Router, Request, Response } from 'express';
import { RequestEntity } from '../entities/request-entity.js';
import { RequestService } from '../services/request-service.js';

const requestRoutes = Router();

requestRoutes.post('/requests', async (req: Request, res: Response) => {
  try {
    const requestData = RequestEntity.from({
      ...req.body,
      headers: JSON.stringify(req.body.headers || {}),
      protocol: req.body.protocol || 'HTTP',
      responseStatus: 0,
      createdAt: new Date(),
    });

    const apiResponse = await RequestService.executeApiRequest(requestData);

    await RequestService.saveApiRequest(requestData);

    res.status(201).json(apiResponse);
  } catch (error: any) {
    console.error('Error executing API request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

requestRoutes.get('/requests', async (_req: Request, res: Response) => {
  try {
    const savedRequests = await RequestService.getSavedRequests();
    res.status(200).json(savedRequests.map((req) => req.toJSON()));
  } catch (error: any) {
    console.error('Error fetching requests:', error.message);
    res.status(500).json({ error: error.message });
  }
});

requestRoutes.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    const savedRequests = await RequestService.getSavedRequests();
    const request = savedRequests.find((r) => r.id === requestId);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json(request.toJSON());
  } catch (error: any) {
    console.error('Error fetching request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

requestRoutes.put('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    const updatedRequestData = RequestEntity.from({
      ...req.body,
      id: requestId,
      headers: JSON.stringify(req.body.headers || {}),
    });

    await RequestService.updateRequest(updatedRequestData);

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (error: any) {
    console.error('Error updating request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

requestRoutes.delete('/requests/:id', async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.id);

    await RequestService.deleteSavedRequest(requestId);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting request:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export { requestRoutes };
