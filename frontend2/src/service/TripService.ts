import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsSignRequest,
} from '@y-celestial/sadalsuud-service';
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

export const getPeriodZh = (period: GetTripsResponse[0]['period']) => {
  if (period === 'afternoon') return '下午';
  if (period === 'allday') return '整天';
  if (period === 'daytime') return '白天';
  if (period === 'evening') return '晚上';
  if (period === 'morning') return '早上';

  return '下半天';
};

export const signTrip = async (id: string, data: PutTripsSignRequest) => {
  await http.put<void, PutTripsSignRequest>(`trips/${id}/sign`, data);
};

export const getTripById = async (id: string) => {
  const res = await http.get<GetTripsIdResponse>(`trips/${id}`);

  return res.data;
};
