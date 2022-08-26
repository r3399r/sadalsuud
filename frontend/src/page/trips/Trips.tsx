import { Button, FormControlLabel, Modal, Switch } from '@mui/material';
import { GetTripsResponse, Status } from '@y-celestial/sadalsuud-service';
import classNames from 'classnames';
import { format } from 'date-fns-tz';
import { zhTW } from 'date-fns/locale';
import { ChangeEvent, useEffect, useState } from 'react';
import Linkify from 'react-linkify';
import { useDispatch } from 'react-redux';
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { getSimplifiedTrips } from 'src/service/TripService';
import { componentDecorator } from 'src/util/linkify';
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
      <FormControlLabel
        control={<Switch checked={switched} onChange={handleSwitch} />}
        label="顯示審核中/未通過"
      />
      <div className={style.head}>
        <h1>出遊清單</h1>
        <Button variant="contained" onClick={() => setOpenRegister(true)}>
          舉辦出遊
        </Button>
      </div>
      {isLoading && <Loader />}
      {trips
        ?.filter((v) => (switched ? true : v.status === Status.Pass))
        .map((v) => {
          if (v.status === Status.Pass) {
            const isExpired = new Date(v.expiredDate ?? 0) < new Date();

            return (
              <div
                key={v.id}
                className={classNames(style.card, style.pass, { [style.expired]: isExpired })}
              >
                <div className={style.item}>
                  <b>主題</b>
                  <div>{v.topic}</div>
                </div>
                <div className={style.item}>
                  <b>日期</b>
                  <div>
                    {format(new Date(v.date), 'yyyy/MM/dd (EEEEE)', {
                      locale: zhTW,
                      timeZone: 'Asia/Taipei',
                    })}
                  </div>
                </div>
                <div className={style.item}>
                  <b>時段</b>
                  <div>
                    {`${format(new Date(v.meetDate), 'HH:mm', {
                      timeZone: 'Asia/Taipei',
                    })}~${format(new Date(v.dismissDate), 'HH:mm', { timeZone: 'Asia/Taipei' })}`}
                  </div>
                </div>
                <div className={style.item}>
                  <b>地點</b>
                  <div>{`${v.region} (確切集合、解散地點將於確定出遊後通知)`}</div>
                </div>
                <Linkify componentDecorator={componentDecorator}>
                  <div className={style.ad}>{v.ad}</div>
                </Linkify>
                <div className={style.item}>
                  <b>大致費用</b>
                  <div>${v.fee}</div>
                </div>
                <div className={style.item}>
                  <b>其他注意事項</b>
                  <Linkify componentDecorator={componentDecorator}>{v.other}</Linkify>
                </div>
                <div className={style.item}>
                  <b>負責人</b>
                  <div>{v.ownerName}</div>
                </div>
                <div className={style.item}>
                  <b>報名截止日</b>
                  <div>
                    {v.expiredDate
                      ? format(new Date(v.expiredDate), 'yyyy/MM/dd (EEEEE) HH:mm', {
                          locale: zhTW,
                          timeZone: 'Asia/Taipei',
                        })
                      : '無'}
                  </div>
                </div>
                <div className={style.item}>
                  <b>出遊通知日</b>
                  <div>
                    {v.notifyDate
                      ? format(new Date(v.notifyDate), 'yyyy/MM/dd (EEEEE)', {
                          locale: zhTW,
                          timeZone: 'Asia/Taipei',
                        })
                      : '無'}
                  </div>
                </div>
                <div className={style.signButn}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      setOpenSign(true);
                      setSignedTripId(v.id);
                    }}
                    disabled={isExpired}
                  >
                    {isExpired ? '已截止' : '報名'}
                  </Button>
                </div>
              </div>
            );
          }
          if (v.status === Status.Reject)
            return (
              <div key={v.id} className={classNames(style.card, style.reject)}>
                <div className={style.item}>
                  <b>狀態</b>
                  <b>未通過</b>
                </div>
                <div className={style.item}>
                  <b>未通過原因</b>
                  <div>{v.reason}</div>
                </div>
                <hr />
                <div className={style.item}>
                  <b>主題</b>
                  <div>{v.topic}</div>
                </div>
                <div className={style.item}>
                  <b>日期</b>
                  <div>
                    {format(new Date(v.date), 'yyyy/MM/dd (EEEEE)', {
                      locale: zhTW,
                      timeZone: 'Asia/Taipei',
                    })}
                  </div>
                </div>
                <div className={style.item}>
                  <b>負責人</b>
                  <div>{v.ownerName}</div>
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
                <div>{v.topic}</div>
              </div>
              <div className={style.item}>
                <b>日期</b>
                <div>
                  {format(new Date(v.date), 'yyyy/MM/dd (EEEEE)', {
                    locale: zhTW,
                    timeZone: 'Asia/Taipei',
                  })}
                </div>
              </div>
              <div className={style.item}>
                <b>負責人</b>
                <div>{v.ownerName}</div>
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
