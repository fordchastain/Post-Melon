import { TemplateRepository } from '../db/template-repository.js';
import { TemplateEntity } from '../entities/template-entity.js';
import { encrypt, decrypt } from './encryption-service.js';

export class TemplateService {
  private templateRepo = new TemplateRepository();

  public async createTemplate(template: TemplateEntity): Promise<number> {
    const newTemplate = new TemplateEntity({ ...template });

    if (newTemplate.encrypted) {
      newTemplate.body = encrypt(newTemplate.body);
    }

    const templateId = await this.templateRepo.createTemplate(newTemplate);
    return templateId;
  }

  public async getTemplates(limit: number, offset: number): Promise<TemplateEntity[]> {
    const templates = await this.templateRepo.getTemplates(limit, offset);

    return templates.map((template: any) => {
      const processedTemplate = new TemplateEntity({ ...template });

      if (processedTemplate.encrypted) {
        processedTemplate.body = decrypt(processedTemplate.body);
      }

      return processedTemplate;
    });
  }

  public async getTemplateById(id: number): Promise<TemplateEntity> {
    const template = await this.templateRepo.getTemplateById(id);
    return TemplateEntity.from(template.encrypted ? { ...template, body: decrypt(template.body) } : template);
  }

  public async updateTemplate(id: number, updatedData: TemplateEntity): Promise<void> {
    const updatedTemplate = new TemplateEntity({ ...updatedData });

    if (updatedTemplate.encrypted) {
      updatedTemplate.body = encrypt(updatedTemplate.body);
    }

    await this.templateRepo.updateTemplate(updatedTemplate);
  }

  public async deleteTemplate(id: number): Promise<void> {
    await this.templateRepo.deleteTemplate(id);
  }
}
