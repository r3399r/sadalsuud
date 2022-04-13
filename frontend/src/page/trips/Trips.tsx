import { Button, FormControlLabel, Modal, Switch } from '@mui/material';
import { GetTripsResponse, Status } from '@y-celestial/sadalsuud-service';
import classNames from 'classnames';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { getPeriodZh, getSimplifiedTrips } from 'src/service/TripService';
import SignForm from './component/SignForm';
import TripsForm from './component/TripsForm';
import style from './Trips.module.scss';

const Trips = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openSign, setOpenSign] = useState<boolean>(false);
  const [signedTripId, setSignedTripId] = useState<string>();
  const [trips, setTrips] = useState<GetTripsResponse>();
  const [switched, setSwitched] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getSimplifiedTrips()
      .then((res) => setTrips(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
    setSwitched(event.target.checked);
  };

  return (
    <>
      <div className={style.btn}>
        <Button variant="contained" onClick={() => setOpenRegister(true)}>
          我要舉辦出遊
        </Button>
        <FormControlLabel
          control={<Switch checked={switched} onChange={handleSwitch} />}
          label="顯示審核中/未通過"
        />
      </div>
      {isLoading && <Loader />}
      {trips
        ?.filter((v) => (switched ? true : v.status === Status.Pass))
        .map((v) => {
          if (v.status === Status.Pass)
            return (
              <div key={v.id} className={classNames(style.card, style.pass)}>
                <div className={style.item}>
                  <b>主題</b>
                  {v.topic}
                </div>
                <div className={style.item}>
                  <b>日期</b>
                  {v.date}
                </div>
                <div className={style.item}>
                  <b>時段</b>
                  {getPeriodZh(v.period)}
                </div>
                <div className={style.item}>
                  <b>地點</b>
                  {v.region}
                </div>
                <div className={style.ad}>{v.ad}</div>
                <div className={style.item}>
                  <b>大致費用</b>${v.fee}
                </div>
                <div className={style.item}>
                  <b>其他注意事項</b>
                  {v.other}
                </div>
                <div className={style.item}>
                  <b>負責人</b>
                  {v.ownerName}
                </div>
                <div className={style.item}>
                  <b>報名截止日</b>
                  {v.expiredDate}
                </div>
                <div className={style.item}>
                  <b>出遊通知日</b>
                  {v.notifyDate}
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
            );

          if (v.status === Status.Reject)
            return (
              <div key={v.id} className={classNames(style.card, style.reject)}>
                <div className={style.item}>
                  <b>狀態</b>
                  <b>未通過</b>
                </div>
                <div className={style.item}>
                  <b>未通過原因</b>
                  {v.reason}
                </div>
                <hr />
                <div className={style.item}>
                  <b>主題</b>
                  {v.topic}
                </div>
                <div className={style.item}>
                  <b>日期</b>
                  {v.date}
                </div>
                <div className={style.item}>
                  <b>負責人</b>
                  {v.ownerName}
                </div>
              </div>
            );

          return (
            <div key={v.id} className={classNames(style.card, style.pending)}>
              <div className={style.item}>
                <b>狀態</b>
                <b>審核中</b>
              </div>
              <hr />
              <div className={style.item}>
                <b>主題</b>
                {v.topic}
              </div>
              <div className={style.item}>
                <b>日期</b>
                {v.date}
              </div>
              <div className={style.item}>
                <b>負責人</b>
                {v.ownerName}
              </div>
            </div>
          );
        })}
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