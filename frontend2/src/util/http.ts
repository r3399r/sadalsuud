import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 3000,
};

export const post = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...config,
    url,
    data,
    method: 'post',
  });
