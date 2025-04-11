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

export const getRequests = async () => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json();
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
