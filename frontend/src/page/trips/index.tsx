import { Button, FormControlLabel, Switch } from '@mui/material';
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
import SignFormModal from './component/SignFormModal';
import TripsFormModal from './component/TripsFormModal';

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
        label="顯示審核中"
      />
      <div className="flex justify-between">
        <h1>出遊清單</h1>
        <Button variant="contained" onClick={() => setOpenRegister(true)}>
          舉辦出遊
        </Button>
      </div>
      {trips
        ?.filter((v) => (switched ? v.status !== Status.Reject : v.status === Status.Pass))
        .map((v) => {
          if (v.status === Status.Pass) {
            const isExpired = new Date(v.expiredDate ?? 0) < new Date();

            return (
              <div
                key={v.id}
                className={classNames('rounded-[5px] my-2 p-2 whitespace-pre-line', {
                  'bg-palegreen/40': isExpired,
                  'bg-palegreen': !isExpired,
                })}
              >
                <div className="flex items-center gap-[6px]">
                  <b>主題</b>
                  <div>{v.topic}</div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <b>日期</b>
                  <div>
                    {format(new Date(v.date), 'yyyy/MM/dd (EEEEE)', {
                      locale: zhTW,
                      timeZone: 'Asia/Taipei',
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <b>時段</b>
                  <div>
                    {`${format(new Date(v.meetDate), 'HH:mm', {
                      timeZone: 'Asia/Taipei',
                    })}~${format(new Date(v.dismissDate), 'HH:mm', { timeZone: 'Asia/Taipei' })}`}
                  </div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <b>地點</b>
                  <div>{`${v.region} (確切集合、解散地點將於確定出遊後通知)`}</div>
                </div>
                <Linkify componentDecorator={componentDecorator}>
                  <div className="my-1 rounded-[5px] border border-solid border-grey bg-lightgrey p-2">
                    {v.ad}
                  </div>
                </Linkify>
                <div className="flex items-center gap-[6px]">
                  <b>大致費用</b>
                  <div>${v.fee}</div>
                </div>
                <div className="flex items-center gap-[6px]">
                  <b>其他注意事項</b>
                  <Linkify componentDecorator={componentDecorator}>{v.other}</Linkify>
                </div>
                <div className="flex items-center gap-[6px]">
                  <b>負責人</b>
                  <div>{v.ownerName}</div>
                </div>
                <div className="flex items-center gap-[6px]">
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
                <div className="flex items-center gap-[6px]">
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
                <div className="mt-[5px] text-right">
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

          return (
            <div key={v.id} className="my-2 whitespace-pre-line rounded-[5px] bg-palered p-2">
              <div className="flex items-center gap-[6px]">
                <b>狀態</b>
                <b>審核中</b>
              </div>
              <hr />
              <div className="flex items-center gap-[6px]">
                <b>主題</b>
                <div>{v.topic}</div>
              </div>
              <div className="flex items-center gap-[6px]">
                <b>日期</b>
                <div>
                  {format(new Date(v.date), 'yyyy/MM/dd (EEEEE)', {
                    locale: zhTW,
                    timeZone: 'Asia/Taipei',
                  })}
                </div>
              </div>
              <div className="flex items-center gap-[6px]">
                <b>負責人</b>
                <div>{v.ownerName}</div>
              </div>
            </div>
          );
        })}
      <TripsFormModal
        open={openRegister}
        handleClose={() => setOpenRegister(false)}
        setIsLoading={(loading) => setIsLoading(loading)}
      />
      <SignFormModal
        open={openSign}
        handleClose={() => setOpenSign(false)}
        tripId={signedTripId}
        setIsLoading={(loading) => setIsLoading(loading)}
      />
      {isLoading && <Loader />}
    </>
  );
};

export default Trips;
