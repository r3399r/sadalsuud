import { Button } from '@mui/material';
import { GetTripsIdResponse, PutTripsIdRequest } from '@y-celestial/sadalsuud-service';
import { format } from 'date-fns-tz';
import { zhTW } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Linkify from 'react-linkify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FormInput from 'src/component/FormInput';
import Loader from 'src/component/Loader';
import { RootState } from 'src/redux/store';
import { openSnackbar } from 'src/redux/uiSlice';
import { getTripById, modifyTripById } from 'src/service/TripService';
import { componentDecorator } from 'src/util/linkify';
import style from './TripDetail.module.scss';

type Form = PutTripsIdRequest & { date: string };

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
        setValue('meetDate', res.meetDate);
        setValue('dismissDate', res.dismissDate);
        setValue('region', res.region);
        setValue('meetPlace', res.meetPlace);
        setValue('dismissPlace', res.dismissPlace);
        setValue('fee', res.fee);
        setValue('other', res.other ?? '');
      })
      .catch(() => dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' })))
      .finally(() => setIsLoading(false));
  }, [id]);

  const onSave = () => {
    if (id === undefined) return;
    const data = getValues();
    setIsLoading(true);
    modifyTripById(id, {
      ...data,
      meetDate: new Date(data.meetDate).toISOString(),
      dismissDate: new Date(data.dismissDate).toISOString(),
      fee: parseInt(String(data.fee)),
      other: data.other === '' ? undefined : data.other,
    })
      .then((res) => setTrip(res))
      .catch(() => dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' })))
      .finally(() => setIsLoading(false));
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
              <FormInput
                control={control}
                name="ad"
                size="small"
                multiline
                minRows={2}
                maxRows={5}
                fullWidth
              />
            ) : (
              <Linkify componentDecorator={componentDecorator}>
                <div>{trip.ad}</div>
              </Linkify>
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
              <Linkify componentDecorator={componentDecorator}>
                <div>{trip.content}</div>
              </Linkify>
            )}
          </div>
          <div>
            <b>日期</b>
            {isEdit ? (
              <FormInput formType="datePicker" control={control} name="date" size="small" />
            ) : (
              <div>
                {format(new Date(trip.date), 'yyyy/MM/dd (EEEEE)', {
                  locale: zhTW,
                  timeZone: 'Asia/Taipei',
                })}
              </div>
            )}
          </div>
          <div>
            <b>時間</b>
            {isEdit ? (
              <div className={style.align}>
                <FormInput formType="timePicker" control={control} name="meetDate" size="small" />~
                <FormInput
                  formType="timePicker"
                  control={control}
                  name="dismissDate"
                  size="small"
                />
              </div>
            ) : (
              <div>
                {`${format(new Date(trip.meetDate), 'HH:mm', { timeZone: 'Asia/Taipei' })}~${format(
                  new Date(trip.dismissDate),
                  'HH:mm',
                  { timeZone: 'Asia/Taipei' },
                )}`}
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
                multiline
                minRows={2}
                maxRows={5}
              />
            ) : (
              <Linkify componentDecorator={componentDecorator}>
                <div>{trip.other}</div>
              </Linkify>
            )}
          </div>
          <div className={style.last}>
            <b>負責人</b>
            <div>{trip.ownerName}</div>
          </div>
        </form>
      )}
      {isLogin && (
        <div className={style.buttons}>
          <Button
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
          {isEdit && (
            <Button variant="contained" onClick={() => setIsEdit(false)}>
              取消
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default TripDetail;
