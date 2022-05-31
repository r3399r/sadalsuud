import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsIdSign,
  GetTripsResponse,
  PostTripsRequest,
  PutSignIdRequest,
  PutTripsIdMember,
  PutTripsIdRequest,
  PutTripsIdResponse,
  PutTripsIdVerifyRequest,
  PutTripsSignRequest,
} from '@y-celestial/sadalsuud-service';
import { dispatch } from 'src/redux/store';
import * as http from 'src/util/http';

export const registerTrip = async (data: PostTripsRequest) => {
  await http.post<void, PostTripsRequest>('trips', data);
};

export const getSimplifiedTrips = async () => {
  const res = await http.get<GetTripsResponse>('trips');

  return res.data;
};

export const getDetailedTrips = async () => {
  const res = await http.authGet<GetTripsDetailResponse>('trips/detail');

  return res.data;
};

export const signTrip = async (id: string, data: PutTripsSignRequest) => {
  await http.put<void, PutTripsSignRequest>(`trips/${id}/sign`, data);
};

export const getTripById = async (id: string) => {
  const res = await http.get<GetTripsIdResponse>(`trips/${id}`);

  return res.data;
};

export const modifyTripById = async (id: string, data: PutTripsIdRequest) => {
  const res = await http.authPut<PutTripsIdResponse, PutTripsIdRequest>(`trips/${id}`, data);

  return res.data;
};

export const deleteTripById = async (id: string) => {
  await http.authDelete(`trips/${id}`);
};

export const verifyTrip = async (id: string, data: PutTripsIdVerifyRequest) => {
  await http.authPut<void, PutTripsIdVerifyRequest>(`trips/${id}/verify`, data);
};

export const getSign = async (id: string, code: string) => {
  const res = await http.get<GetTripsIdSign>(`trips/${id}/sign`, { code });

  return res.data;
};

export const editSignComment = async (id: string, comment: string) => {
  await http.put<void, PutSignIdRequest>(`sign/${id}`, { comment });
};

export const setTripMember = async (id: string, signId: string[]) => {
  await http.authPut<void, PutTripsIdMember>(`trips/${id}/member`, { signId });
};

export const deleteSignById = async (id: string) => {
  await http.authDelete(`sign/${id}`);
};
