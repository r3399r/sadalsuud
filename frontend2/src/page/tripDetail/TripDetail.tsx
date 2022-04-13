import { GetTripsIdResponse, Status } from '@y-celestial/sadalsuud-service';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { getTripById } from 'src/service/TripService';
import style from './TripDetail.module.scss';

const TripDetail = () => {
  const dispatch = useDispatch();
  const [trip, setTrip] = useState<GetTripsIdResponse>();
  const { id } = useParams();

  useEffect(() => {
    if (id !== undefined)
      getTripById(id)
        .then((res) => setTrip(res))
        .catch(() => {
          dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
        });
  }, [id]);

  return (
    <>
      {trip === undefined && <Loader />}
      {trip && trip.status === Status.Pending && (
        <div>此出遊申請正在審核中，申請人: {trip.ownerName}。</div>
      )}
      {trip && trip.status === Status.Reject && (
        <div>
          此出遊申請已被拒絕，申請人: {trip.ownerName}，拒絕原因: {trip.reason}。
        </div>
      )}
      {trip && trip.status === Status.Pass && (
        <div className={style.self}>
          <div>
            <b>主題</b>
            {trip.topic}
          </div>
          <div>
            <b>活動內容</b>
            {trip.content}
          </div>
          <div>
            <b>日期</b>
            {trip.date}
          </div>
          <div>
            <b>集合時間</b>
            {trip.meetTime}
          </div>
          <div>
            <b>集合地點</b>
            {trip.meetPlace}
          </div>
          <div>
            <b>解散時間</b>
            {trip.dismissTime}
          </div>
          <div>
            <b>解散地點</b>
            {trip.dismissPlace}
          </div>
          <div>
            <b>大致花費</b>${trip.fee}
          </div>
          <div>
            <b>其他注意事項</b>
            {trip.other}
          </div>
          <div>
            <b>負責人</b>
            {trip.ownerName}
          </div>
        </div>
      )}
    </>
  );
};

export default TripDetail;
