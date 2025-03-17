import { initializeDatabase } from './database.js';
import { RequestEntity } from '../entities/request-entity.js';

export class RequestRepository {
  private db = initializeDatabase();

  private INSERT_REQUEST = `
    INSERT INTO request (name, method, protocol, url, headers, body, graphql_query, websocket_event, grpc_method,
      encrypted, response_status, response_body, response_headers, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  private GET_ALL_REQUESTS = `
    SELECT * FROM request 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
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
            console.log(err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });
  }

  getRequests(): Promise<RequestEntity[]> {
    return new Promise((resolve, reject) => {
      this.db.all(this.GET_ALL_REQUESTS, (err, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows.map(RequestEntity.from));
      });
    });
  }

  deleteRequest(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(this.DELETE_REQUEST, [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
