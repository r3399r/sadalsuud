import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 5000,
};

export const get = async <T>(url: string) =>
  axios.request<T>({
    ...config,
    url,
    method: 'get',
  });

export const post = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...config,
    url,
    data,
    method: 'post',
  });
