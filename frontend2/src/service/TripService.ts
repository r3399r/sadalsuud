import { PostTripsRequest } from '@y-celestial/sadalsuud-service';
import * as http from 'src/util/http';

export const registerTrip = async (data: PostTripsRequest) => {
  await http.post<void, PostTripsRequest>('trips', data);
};
