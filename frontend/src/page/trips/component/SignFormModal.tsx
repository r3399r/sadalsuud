import { Button } from '@mui/material';
import { PutTripsSignRequest } from '@y-celestial/sadalsuud-service';
import { format } from 'date-fns';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import FormInput from 'src/component/FormInput';
import FormRadio from 'src/component/FormRadio';
import Modal from 'src/component/Modal';
import { openSnackbar } from 'src/redux/uiSlice';
import { signTrip } from 'src/service/TripService';

type Form = PutTripsSignRequest;

type TripsFormProps = {
  open: boolean;
  handleClose: () => void;
  tripId?: string;
  setIsLoading: (loading: boolean) => void;
};

const SignFormModal = ({ open, handleClose, tripId = 'xxx', setIsLoading }: TripsFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const forWho = useWatch({ control, name: 'forWho' });
  const onSubmit: SubmitHandler<Form> = (data) => {
    handleClose();
    setIsLoading(true);
    signTrip(tripId, {
      ...data,
      line: data.line === '' ? undefined : data.line,
      birthYear: format(new Date(data.birthYear), 'yyyy'),
    })
      .then(() => {
        reset();
        dispatch(openSnackbar({ severity: 'success', message: '已報名成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '報名失敗，請重試' }));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal open={open} handleClose={handleClose} disableBackdropClick>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRadio
          control={control}
          name="forWho"
          items={[
            { value: 'self', label: '我自己要報名參加' },
            { value: 'kid', label: '幫小孩報名參加' },
          ]}
        />
        {forWho && (
          <div className="flex flex-col gap-[10px]">
            <div className="text-right text-sm">* 為必填項目</div>
            <FormInput
              control={control}
              name="name"
              rules={{ required: true }}
              label={forWho === 'kid' ? '小孩的名字*' : '你的名字*'}
              size="small"
              error={errors.name !== undefined}
            />
            <FormInput
              control={control}
              name="phone"
              rules={{ required: true, pattern: /^[0-9]+$/i }}
              label={forWho === 'kid' ? '家長的聯絡電話*' : '聯絡電話*'}
              helperText="此為通知時使用，通知中籤或通知活動內容"
              size="small"
              error={errors.phone !== undefined}
            />
            <FormInput
              control={control}
              name="line"
              label={forWho === 'kid' ? '家長的 LINE ID' : 'LINE ID'}
              helperText="若有 LINE ID，通知更方便"
              size="small"
            />
            <FormInput
              formType="yearPicker"
              control={control}
              name="birthYear"
              label={forWho === 'kid' ? '小孩的出生年(西元)*' : '出生年(西元)*'}
              rules={{ required: true }}
              helperText="此為遇到同名同姓時識別用"
              size="small"
              error={errors.birthYear !== undefined}
            />
            {forWho === 'kid' && (
              <div className="flex items-center gap-[15px]">
                是否陪小孩同行:
                <FormRadio
                  control={control}
                  name="accompany"
                  defaultValue="yes"
                  items={[
                    { value: 'yes', label: '是' },
                    { value: 'no', label: '否' },
                  ]}
                />
              </div>
            )}
          </div>
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
          {forWho && (
            <Button className="flex-1" variant="contained" type="submit">
              送出
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default SignFormModal;
