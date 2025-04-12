import { KeyValue } from '../types/request';

export const createObjectFromKeyValueArray = (keyValueArray: KeyValue[]) => {
  return Object.fromEntries(keyValueArray.map(({ key, value }) => (key !== '' ? [key, value] : [])));
};

export const buildUrlWithQueryParameters = (baseUrl: string, queryParams: KeyValue[]) => {
  let url = (baseUrl += baseUrl.includes('?') ? '&' : '?');
  queryParams.forEach((x) => (url += x.key !== '' ? `${x.key}=${x.value}&` : ''));
  return url.replace(/&$/, '');
};
