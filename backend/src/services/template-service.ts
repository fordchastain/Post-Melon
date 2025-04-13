import { TemplateRepository } from '../db/template-repository.js';
import { TemplateEntity } from '../entities/template-entity.js';

export class TemplateService {
  private templateRepo = new TemplateRepository();

  public async createTemplate(template: TemplateEntity): Promise<number> {
    const newTemplate = new TemplateEntity({ ...template });
    const templateId = await this.templateRepo.createTemplate(newTemplate);
    return templateId;
  }

  public async getTemplates(limit: number, offset: number): Promise<TemplateEntity[]> {
    const templates = await this.templateRepo.getTemplates(limit, offset);

    return templates.map((template: any) => {
      return new TemplateEntity({ ...template });
    });
  }

  public async getTemplateById(id: number): Promise<TemplateEntity> {
    return await this.templateRepo.getTemplateById(id);
  }

  public async updateTemplate(id: number, updatedData: TemplateEntity): Promise<void> {
    await this.templateRepo.updateTemplate(updatedData);
  }

  public async deleteTemplate(id: number): Promise<void> {
    await this.templateRepo.deleteTemplate(id);
  }
}
