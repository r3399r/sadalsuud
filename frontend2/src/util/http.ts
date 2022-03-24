import axios, { AxiosRequestConfig } from 'axios';
import { reset } from 'src/redux/authSlice';
import { dispatch } from 'src/redux/store';

const config: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 5000,
};

export const get = async <T>(url: string, params?: any) =>
  axios.request<T>({
    ...config,
    url,
    method: 'get',
    params,
  });

export const authGet = async <T>(url: string, params?: any) => {
  try {
    const secret = localStorage.getItem('secret');

    return await axios.request<T>({
      ...config,
      url,
      method: 'get',
      params,
      headers: { 'x-api-secret': secret ?? 'zzz' },
    });
  } catch {
    localStorage.removeItem('secret');
    dispatch(reset());
    throw new Error('auth expired');
  }
};

export const post = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...config,
    url,
    data,
    method: 'post',
  });

export const put = async <T, D>(url: string, data: D) =>
  axios.request<T>({
    ...config,
    url,
    data,
    method: 'put',
  });
