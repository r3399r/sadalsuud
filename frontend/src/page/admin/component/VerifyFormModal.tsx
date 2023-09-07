import { Button } from '@mui/material';
import { endOfDay, getHours, getMinutes, set } from 'date-fns';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import FormInput from 'src/component/FormInput';
import FormRadio from 'src/component/FormRadio';
import Modal from 'src/component/Modal';
import { openSnackbar } from 'src/redux/uiSlice';
import { verifyTrip } from 'src/service/TripService';

type Form = {
  pass: 'yes' | 'no';
  expiredDate: string;
  expiredTime: string;
  notifyDate: string;
  reason: string;
};

type VerifyFormProps = {
  open: boolean;
  id?: string;
  handleClose: () => void;
};

const VerifyFormModal = ({ open, id = 'zzz', handleClose }: VerifyFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const pass = useWatch({ control, name: 'pass' });
  const onSubmit: SubmitHandler<Form> = (data) => {
    const expiredTime = new Date(data.expiredTime);
    handleClose();
    verifyTrip(
      id,
      data.pass === 'yes'
        ? {
            pass: 'yes',
            expiredDate: set(new Date(data.expiredDate), {
              hours: getHours(expiredTime),
              minutes: getMinutes(expiredTime),
            }).toISOString(),
            notifyDate: endOfDay(new Date(data.notifyDate)).toISOString(),
          }
        : { pass: 'no', reason: data.reason },
    )
      .then(() => {
        reset();
        dispatch(openSnackbar({ severity: 'success', message: '設定成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '設定失敗，請重試' }));
      });
  };

  return (
    <Modal open={open} handleClose={handleClose} disableBackdropClick>
      <form className="flex flex-col gap-[10px]" onSubmit={handleSubmit(onSubmit)}>
        <FormRadio
          control={control}
          name="pass"
          items={[
            { value: 'yes', label: '通過' },
            { value: 'no', label: '拒絕' },
          ]}
        />
        {pass === 'yes' && (
          <div className="flex gap-[10px]">
            <div className="flex-1">
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
            </div>
            <div className="flex-1">
              <FormInput
                formType="timePicker"
                control={control}
                name="expiredTime"
                rules={{ required: true }}
                label="報名截止時間"
                size="small"
                error={errors.expiredTime !== undefined}
              />
            </div>
          </div>
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
        <div className="flex gap-[10px]">
          <Button
            className="flex-1"
            variant="outlined"
            color="error"
            type="button"
            onClick={handleClose}
          >
            取消
          </Button>
          <Button className="flex-1" variant="contained" type="submit">
            送出
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VerifyFormModal;
