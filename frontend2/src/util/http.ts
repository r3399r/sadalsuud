import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { reset } from 'src/redux/authSlice';
import { dispatch } from 'src/redux/store';

const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 5000,
};

export const get = async <T>(url: string, params?: any) =>
  axios.request<T>({
    ...defaultConfig,
    url,
    method: 'get',
    params,
  });

export const post = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...defaultConfig,
    url,
    data,
    method: 'post',
  });

export const put = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...defaultConfig,
    url,
    data,
    method: 'put',
  });

const authRequest = async <T>(config: AxiosRequestConfig) => {
  try {
    const secret = localStorage.getItem('secret');

    return await axios.request<T>({
      ...defaultConfig,
      ...config,
      headers: { 'x-api-secret': secret ?? 'zzz' },
    });
  } catch (e) {
    const error = (e as AxiosError).response;
    if (error?.data.message === 'Unauthorized') {
      localStorage.removeItem('secret');
      dispatch(reset());
      throw new Error('Unauthorized');
    }
    throw e;
  }
};

export const authGet = async <T>(url: string, params?: any) =>
  await authRequest<T>({ url, params, method: 'get' });

export const authPut = async <T, D>(url: string, data: D) =>
  await authRequest<T>({ url, method: 'put', data });

export const authDelete = async <T>(url: string) => await authRequest<T>({ url, method: 'delete' });
