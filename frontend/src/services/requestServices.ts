import { Request, RequestApiResponse } from '../types/request';

const BASE_URL = 'http://localhost:3001/api/requests';

export const createRequest = async (body: any) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
};

export const getRequests = async (limit: number, offset: number) => {
  const url = new URL(BASE_URL);
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('offset', offset.toString());

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json() as Promise<RequestApiResponse>;
};

export const getRequest = async (id: number) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch request ${id}`);
  return response.json();
};

export const deleteRequest = async (id: number) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error(`Failed to delete request ${id}`);
  return response.json();
};
