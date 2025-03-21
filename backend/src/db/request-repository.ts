import { initializeDatabase } from './database.js';
import { RequestEntity } from '../entities/request-entity.js';
import logger from '../services/log-service.js';

export class RequestRepository {
  private db = initializeDatabase();

  private INSERT_REQUEST = `
    INSERT INTO request (name, method, protocol, url, headers, body, graphql_query, websocket_event, grpc_method,
      encrypted, response_status, response_body, response_headers, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  private GET_REQUESTS = `
    SELECT * FROM request 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  private GET_REQUEST_BY_ID = `
    SELECT * FROM request WHERE id = ?
  `;

  private DELETE_REQUEST = `
    DELETE FROM request WHERE id = ?
  `;

  saveRequest(request: RequestEntity): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        this.INSERT_REQUEST,
        [
          request.name,
          request.method,
          request.protocol,
          request.url,
          JSON.stringify(request.headers),
          request.body,
          request.graphqlQuery ?? '',
          request.websocketEvent ?? '',
          request.grpcMethod ?? '',
          request.encrypted ? 1 : 0,
          request.responseStatus,
          typeof request.responseBody === 'object'
            ? JSON.stringify(request.responseBody)
            : (request.responseBody ?? ''),
          JSON.stringify(request.responseHeaders),
          request.createdAt.toISOString(),
        ],
        function (err) {
          if (err) {
            logger.error(err.message, err);
            reject(err);
          } else {
            logger.info('Succesfully saved request.')
            resolve();
          }
        },
      );
    });
  }

  getRequests(limit: number, offset: number): Promise<RequestEntity[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.GET_REQUESTS, [limit, offset], (err, rows: RequestEntity[]) => {
        if (err) {
          logger.error(err.message, err);
          reject(err);
        } else {
          logger.info('Successfully fetched requests');
          resolve(rows);
        }
      });
    });
  }

  getRequestById(id: number): Promise<RequestEntity> {
    return new Promise((resolve, reject) => {
      this.db.get(this.GET_REQUEST_BY_ID, [id], (err, row: RequestEntity) => {
        if (err) {
          logger.error("Database error:", err);
          return reject(err);
        }
  
        if (!row) {
          logger.warn(`No request found with id: ${id}`);
          return reject(new Error(`Request with id ${id} not found`));
        }
  
        logger.info(`Successfully fetched request with id ${id}`);
        resolve(row);
      });
    });
  }

  deleteRequest(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.DELETE_REQUEST, [id], function (err) {
        if (err) {
          logger.error(err.message, err);
          reject(err);
        } else {
          logger.info('Succesfully deleted request');
          resolve();
        }
      });
    });
  }
}
