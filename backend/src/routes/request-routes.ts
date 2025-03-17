import { Router } from 'express';
import { RequestController } from '../controllers/request-controller.js';

const requestRoutes = Router();

const requestController = new RequestController();
requestRoutes.post('/requests', requestController.createRequest);
requestRoutes.get('/requests', requestController.getRequests);
requestRoutes.get('/requests/:id', requestController.getRequestById);
requestRoutes.delete('/requests/:id', requestController.deleteRequest);

export { requestRoutes };
