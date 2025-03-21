export class TemplateEntity {
  id?: number;
  name: string = '';
  method: string = 'GET';
  protocol: string = 'HTTP';
  url: string = '';
  headers: Record<string, string> = {};
  body: string = '';
  graphqlQuery?: string;
  websocketEvent?: string;
  grpcMethod?: string;
  encrypted: boolean = false;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(params: Partial<TemplateEntity>) {
    Object.assign(this, params);
  }

  static from(obj: any): TemplateEntity {
    return new TemplateEntity({
      id: obj.id,
      name: obj.name,
      method: obj.method,
      protocol: obj.protocol,
      url: obj.url,
      headers: obj.headers,
      body: obj.body,
      graphqlQuery: obj.graphql_query ?? obj.graphqlQuery,
      websocketEvent: obj.websocket_event ?? obj.websocketEvent,
      grpcMethod: obj.grpc_method ?? obj.grpcMethod,
      encrypted: obj.encrypted === 1 || obj.encrypted === true,
      createdAt: obj.created_at ? new Date(obj.created_at) : (obj.createdAt ?? new Date()),
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      method: this.method,
      protocol: this.protocol,
      url: this.url,
      headers: this.headers,
      body: this.body,
      graphqlQuery: this.graphqlQuery,
      websocketEvent: this.websocketEvent,
      grpcMethod: this.grpcMethod,
      encrypted: this.encrypted,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
