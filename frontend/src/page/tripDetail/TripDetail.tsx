import { Button } from '@mui/material';
import { GetTripsIdResponse, PutTripsIdRequest } from '@y-celestial/sadalsuud-service';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormInput from 'src/component/FormInput';
import Loader from 'src/component/Loader';
import { RootState } from 'src/redux/store';
import { openSnackbar } from 'src/redux/uiSlice';
import { getTripById, modifyTripById } from 'src/service/TripService';
import style from './TripDetail.module.scss';

type Form = PutTripsIdRequest;

const TripDetail = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((rootState: RootState) => rootState.auth);
  const { id } = useParams();
  const [trip, setTrip] = useState<GetTripsIdResponse>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { control, setValue, getValues } = useForm<Form>();

  useEffect(() => {
    if (id === undefined) return;
    setIsLoading(true);
    getTripById(id)
      .then((res) => {
        setTrip(res);
        setValue('topic', res.topic);
        setValue('ad', res.ad);
        setValue('content', res.content);
        setValue('date', res.date);
        setValue('meetTime', new Date(`1970/01/01 ${res.meetTime}`).toISOString());
        setValue('dismissTime', new Date(`1970/01/01 ${res.dismissTime}`).toISOString());
        setValue('region', res.region);
        setValue('meetPlace', res.meetPlace);
        setValue('dismissPlace', res.dismissPlace);
        setValue('fee', res.fee);
        setValue('other', res.other);
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const onSave = () => {
    if (id === undefined) return;
    const data = getValues();
    setIsLoading(true);
    modifyTripById(id, {
      ...data,
      date: new Date(data.date).toISOString(),
      meetTime: format(new Date(data.meetTime), 'HH:mm'),
      dismissTime: format(new Date(data.dismissTime), 'HH:mm'),
      fee: parseInt(String(data.fee)),
      other: data.other === '' ? undefined : data.other,
    })
      .then((res) => setTrip(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loader />}
      {trip && (
        <form className={style.self}>
          <div>
            <b>主題</b>
            {isEdit ? (
              <FormInput control={control} name="topic" size="small" fullWidth />
            ) : (
              <div>{trip.topic}</div>
            )}
          </div>
          <div>
            <b>簡短活動內容</b>
            {isEdit ? (
              <FormInput control={control} name="ad" size="small" multiline rows={2} fullWidth />
            ) : (
              <div>{trip.ad}</div>
            )}
          </div>
          <div>
            <b>詳細活動內容</b>
            {isEdit ? (
              <FormInput
                control={control}
                name="content"
                size="small"
                multiline
                minRows={2}
                maxRows={5}
                fullWidth
              />
            ) : (
              <div>{trip.content}</div>
            )}
          </div>
          <div>
            <b>日期</b>
            {isEdit ? (
              <FormInput formType="datePicker" control={control} name="date" size="small" />
            ) : (
              <div>{format(new Date(trip.date), 'yyyy/MM/dd (EEEEE)', { locale: zhTW })}</div>
            )}
          </div>
          <div>
            <b>時間</b>
            {isEdit ? (
              <div className={style.align}>
                <FormInput formType="timePicker" control={control} name="meetTime" size="small" />~
                <FormInput
                  formType="timePicker"
                  control={control}
                  name="dismissTime"
                  size="small"
                />
              </div>
            ) : (
              <div>
                {trip.meetTime}~{trip.dismissTime}
              </div>
            )}
          </div>
          <div>
            <b>活動區域</b>
            {isEdit ? (
              <FormInput control={control} name="region" size="small" fullWidth />
            ) : (
              <div>{trip.region}</div>
            )}
          </div>
          <div>
            <b>集合地點</b>
            {isEdit ? (
              <FormInput control={control} name="meetPlace" size="small" fullWidth />
            ) : (
              <div>{trip.meetPlace}</div>
            )}
          </div>
          <div>
            <b>解散地點</b>
            {isEdit ? (
              <FormInput control={control} name="dismissPlace" size="small" fullWidth />
            ) : (
              <div>{trip.dismissPlace}</div>
            )}
          </div>
          <div>
            <b>大致花費</b>
            {isEdit ? (
              <div className={style.align}>
                $<FormInput control={control} name="fee" size="small" type="number" />
              </div>
            ) : (
              <div>${trip.fee}</div>
            )}
          </div>
          <div>
            <b>其他注意事項</b>
            {isEdit ? (
              <FormInput
                control={control}
                name="other"
                size="small"
                fullWidth
                minRows={2}
                maxRows={5}
              />
            ) : (
              <div>{trip.other}</div>
            )}
          </div>
          <div className={style.last}>
            <b>負責人</b>
            {trip.ownerName}
          </div>
        </form>
      )}
      {isLogin && (
        <Button
          className={style.button}
          variant="contained"
          color={isEdit ? 'success' : 'error'}
          onClick={() => {
            if (isEdit) onSave();
            setIsEdit(!isEdit);
          }}
          disabled={isLoading}
        >
          {isEdit ? '儲存' : '編輯'}
        </Button>
      )}
    </>
  );
};

export default TripDetail;
