import { Modal } from '@mui/material';
import { GetTripsResponse } from '@y-celestial/sadalsuud-service';
import { useEffect, useState } from 'react';
import Button from 'src/component/Button';
import Loader from 'src/component/Loader';
import { getPeriodZh, getSimplifiedTrips } from 'src/service/TripService';
import TripsForm from './component/TripsForm';
import style from './Trips.module.scss';

const Trips = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [trips, setTrips] = useState<GetTripsResponse>();

  useEffect(() => {
    getSimplifiedTrips().then((res) => setTrips(res));
  }, []);

  return (
    <>
      <div className={style.button}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          申請出遊活動
        </Button>
      </div>
      {trips === undefined && <Loader />}
      {trips?.map((v) => (
        <div key={v.id} className={style.card}>
          <div>主題: {v.topic}</div>
          <div>日期: {v.date}</div>
          <div>時間: {getPeriodZh(v.period)}</div>
          <div>地點: {v.region}</div>
          <div className={style.ad}>{v.ad}</div>
          <div>大致費用: ${v.fee}</div>
          <div>其他注意事項: {v.other}</div>
        </div>
      ))}
      <Modal open={open}>
        <TripsForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
};

export default Trips;
