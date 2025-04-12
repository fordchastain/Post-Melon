import { KeyValue } from '../types/request';

export const createObjectFromKeyValueArray = (keyValueArray: KeyValue[]) => {
  return Object.fromEntries(keyValueArray.map(({ key, value }) => (key !== '' ? [key, value] : [])));
};

export const buildUrlWithQueryParameters = (baseUrl: string, queryParams: KeyValue[]) => {
  const url = new URL(baseUrl);
  queryParams.forEach((x) => url.searchParams.set(x.key, x.value));
  return url.toString();
};

export const getUrlPath = (url: string) => {
  const urlObject = new URL(url);
  return urlObject.pathname + urlObject.search;
};
