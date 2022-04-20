import { Button } from '@mui/material';
import { endOfDay } from 'date-fns';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import FormInput from 'src/component/FormInput';
import FormRadio from 'src/component/FormRadio';
import { openSnackbar } from 'src/redux/uiSlice';
import { verifyTrip } from 'src/service/TripService';
import style from './VerifyForm.module.scss';

type Form = {
  pass: 'yes' | 'no';
  expiredDate: string;
  notifyDate: string;
  reason: string;
};

type VerifyFormProps = { id?: string; onClose: () => void };

const VerifyForm = ({ id = 'zzz', onClose }: VerifyFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  const pass = useWatch({ control, name: 'pass' });
  const onSubmit: SubmitHandler<Form> = (data) => {
    verifyTrip(
      id,
      data.pass === 'yes'
        ? {
            pass: 'yes',
            expiredDate: endOfDay(new Date(data.expiredDate)).toISOString(),
            notifyDate: endOfDay(new Date(data.notifyDate)).toISOString(),
          }
        : { pass: 'no', reason: data.reason },
    )
      .then(() => {
        dispatch(openSnackbar({ severity: 'success', message: '設定成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '設定失敗，請重試' }));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <form className={style.self} onSubmit={handleSubmit(onSubmit)}>
      <FormRadio
        control={control}
        name="pass"
        items={[
          { value: 'yes', label: '通過' },
          { value: 'no', label: '拒絕' },
        ]}
      />
      {pass === 'yes' && (
        <FormInput
          formType="datePicker"
          control={control}
          name="expiredDate"
          rules={{ required: true }}
          minDate={new Date()}
          label="報名截止日"
          size="small"
          error={errors.expiredDate !== undefined}
        />
      )}
      {pass === 'yes' && (
        <FormInput
          formType="datePicker"
          control={control}
          name="notifyDate"
          rules={{ required: true }}
          minDate={new Date()}
          label="通知日"
          size="small"
          error={errors.notifyDate !== undefined}
        />
      )}
      {pass === 'no' && (
        <FormInput
          control={control}
          name="reason"
          rules={{ required: true }}
          label="原因"
          size="small"
          error={errors.reason !== undefined}
        />
      )}
      <div className={style.buttons}>
        <Button variant="outlined" color="error" type="button" onClick={onClose}>
          取消
        </Button>
        <Button variant="contained" type="submit">
          送出
        </Button>
      </div>
    </form>
  );
};

export default VerifyForm;
