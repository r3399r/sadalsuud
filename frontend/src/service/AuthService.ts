import { PostLoginRequest, PostLoginResponse } from '@y-celestial/sadalsuud-service';
import { setLoginStatus } from 'src/redux/authSlice';
import { dispatch } from 'src/redux/store';
import * as http from 'src/util/http';

export const login = async (data: PostLoginRequest) => {
  const res = await http.post<PostLoginResponse, PostLoginRequest>('login', data);

  localStorage.setItem('secret', res.data.secret);
  dispatch(setLoginStatus(true));
};

export const checkLoginStatus = () => {
  const secret = localStorage.getItem('secret');
  if (secret !== null) dispatch(setLoginStatus(true));
};
