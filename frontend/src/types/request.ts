export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestTab = 'params' | 'headers' | 'body' | 'response';

export type KeyValue = { key: string; value: string };

export type Request = {
  id?: number;
  name: string;
  method: string;
  protocol: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  graphqlQuery?: string;
  websocketEvent?: string;
  grpcMethod?: string;
  encrypted: boolean;
  responseStatus: number;
  responseBody?: string | Record<string, string>;
  responseHeaders: Record<string, string>;
  createdAt: Date;
  templateId?: number;
};
