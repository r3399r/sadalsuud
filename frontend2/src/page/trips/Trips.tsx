import { Modal } from '@mui/material';
import { GetTripsResponse } from '@y-celestial/sadalsuud-service';
import { useEffect, useState } from 'react';
import Button from 'src/component/Button';
import Loader from 'src/component/Loader';
import { getPeriodZh, getSimplifiedTrips } from 'src/service/TripService';
import SignForm from './component/SignForm';
import TripsForm from './component/TripsForm';
import style from './Trips.module.scss';

const Trips = () => {
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openSign, setOpenSign] = useState<boolean>(false);
  const [signedTripId, setSignedTripId] = useState<string>();
  const [trips, setTrips] = useState<GetTripsResponse>();

  useEffect(() => {
    getSimplifiedTrips().then((res) => setTrips(res));
  }, []);

  return (
    <>
      <div className={style.registerBtn}>
        <Button variant="contained" onClick={() => setOpenRegister(true)}>
          我要舉辦出遊
        </Button>
      </div>
      {trips === undefined && <Loader />}
      {trips?.map((v) => (
        <div key={v.id} className={style.card}>
          <div>
            <b>主題</b> {v.topic}
          </div>
          <div>
            <b>日期</b> {v.date}
          </div>
          <div>
            <b>時間</b> {getPeriodZh(v.period)}
          </div>
          <div>
            <b>地點</b> {v.region}
          </div>
          <div className={style.ad}>{v.ad}</div>
          <div>
            <b>大致費用</b> ${v.fee}
          </div>
          <div>
            <b>其他注意事項</b> {v.other}
          </div>
          <div className={style.signButn}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                setOpenSign(true);
                setSignedTripId(v.id);
              }}
            >
              報名
            </Button>
          </div>
        </div>
      ))}
      <Modal open={openRegister}>
        <>
          <TripsForm onClose={() => setOpenRegister(false)} />
        </>
      </Modal>
      <Modal open={openSign}>
        <>
          <SignForm onClose={() => setOpenSign(false)} tripId={signedTripId} />
        </>
      </Modal>
    </>
  );
};

export default Trips;
