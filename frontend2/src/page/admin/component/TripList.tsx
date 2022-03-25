import { GetTripsDetailResponse } from '@y-celestial/sadalsuud-service';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { getDetailedTrips } from 'src/service/TripService';

const TripList = () => {
  const dispatch = useDispatch();
  const [trips, setTrips] = useState<GetTripsDetailResponse>();

  useEffect(() => {
    getDetailedTrips()
      .then((res) => setTrips(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      });
  }, []);

  return (
    <>
      {trips === undefined && <Loader />}
      {trips && trips.map((v) => <div key={v.id}>{v.id}</div>)}
    </>
  );
};

export default TripList;
