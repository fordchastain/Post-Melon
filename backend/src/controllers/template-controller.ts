import { Request, Response } from 'express';
import { TemplateService } from '../services/template-service.js';
import logger from '../services/log-service.js';

export class TemplateController {
  private readonly templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();

    this.createTemplate = this.createTemplate.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
    this.getTemplateById = this.getTemplateById.bind(this);
    this.updateTemplate = this.updateTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  }

  public async createTemplate(request: Request, response: Response): Promise<void> {
    try {
      const templateData = {
        ...request.body,
        headers: JSON.stringify(request.body.headers || {}),
        encrypted: !!request.body.encrypted,
      };

      const newTemplateId = await this.templateService.createTemplate(templateData);

      response.status(201).json({ id: newTemplateId });
    } catch (error: any) {
      logger.error('Error creating template:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getTemplates(request: Request, response: Response): Promise<void> {
    try {
      const limit = parseInt(request.query.limit as string, 10) || 10;
      const offset = parseInt(request.query.offset as string, 10) || 0;

      const templates = await this.templateService.getTemplates(limit, offset);

      response.status(200).json(templates);
    } catch (error: any) {
      logger.error('Error fetching templates:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async getTemplateById(request: Request, response: Response): Promise<void> {
    try {
      const templateId = parseInt(request.params.id);

      const template = await this.templateService.getTemplateById(templateId);

      if (!template) {
        response.status(404).json({ error: 'Template not found' });
        return;
      }

      response.status(200).json(template);
    } catch (error: any) {
      logger.error('Error fetching template:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async updateTemplate(request: Request, response: Response): Promise<void> {
    try {
      const templateId = parseInt(request.params.id);
      const updatedData = {
        ...request.body,
        headers: JSON.stringify(request.body.headers || {}),
        encrypted: !!request.body.encrypted,
      };

      await this.templateService.updateTemplate(templateId, updatedData);

      response.status(200).json({ message: 'Template updated successfully' });
    } catch (error: any) {
      logger.error('Error updating template:', error.message);
      response.status(500).json({ error: error.message });
    }
  }

  public async deleteTemplate(request: Request, response: Response): Promise<void> {
    try {
      const templateId = parseInt(request.params.id);

      await this.templateService.deleteTemplate(templateId);

      response.status(200).json({ message: 'Template deleted successfully' });
    } catch (error: any) {
      logger.error('Error deleting template:', error.message);
      response.status(500).json({ error: error.message });
    }
  }
}
