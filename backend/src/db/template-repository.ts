import { TemplateEntity } from '../entities/template-entity.js';
import { initializeDatabase } from './database.js';

export class TemplateRepository {
  private db = initializeDatabase();

  private INSERT_TEMPLATE = `
    INSERT INTO template (name, method, protocol, url, headers, body, graphql_query, websocket_event, grpc_method,
      encrypted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  private UPDATE_TEMPLATE = `
    UPDATE template
    SET name = ?, method = ?, protocol = ?, url = ?, headers = ?, body = ?, graphql_query = ?, websocket_event = ?,
      grpc_method = ?, encrypted = ?, updated_at = datetime('now')
    WHERE id = ?
  `;

  private GET_TEMPLATES = `
    SELECT * FROM template 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  private GET_TEMPLATE_BY_ID = `
    SELECT * FROM template WHERE id = ?
  `;

  private DELETE_TEMPLATE = `
    DELETE FROM template WHERE id = ?
  `;

  async createTemplate(template: TemplateEntity): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.run(
        this.INSERT_TEMPLATE,
        [
          template.name,
          template.method,
          template.protocol,
          template.url,
          template.headers,
          template.body,
          template.graphqlQuery,
          template.websocketEvent,
          template.grpcMethod,
          template.encrypted ? 1 : 0,
        ],
        function (err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        },
      );
    });
  }

  async updateTemplate(template: TemplateEntity): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        this.UPDATE_TEMPLATE,
        [
          template.name,
          template.method,
          template.protocol,
          template.url,
          template.headers,
          template.body,
          template.graphqlQuery,
          template.websocketEvent,
          template.grpcMethod,
          template.encrypted ? 1 : 0,
          template.id,
        ],
        function (err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  async getTemplates(limit: number = 10, offset: number = 0): Promise<TemplateEntity[]> {
    return new Promise<TemplateEntity[]>((resolve, reject) => {
      this.db.all(this.GET_TEMPLATES, [limit, offset], (err: Error | null, rows: TemplateEntity[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getTemplateById(id: number): Promise<TemplateEntity> {
    return new Promise<TemplateEntity>((resolve, reject) => {
      this.db.get(this.GET_TEMPLATE_BY_ID, [id], (err, row: TemplateEntity) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async deleteTemplate(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(this.DELETE_TEMPLATE, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
