import { PutTripsSignRequest } from '@y-celestial/sadalsuud-service';
import { format } from 'date-fns';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import FormCheckbox from 'src/component/FormCheckbox';
import FormInput from 'src/component/FormInput';
import FormRadio from 'src/component/FormRadio';
import { openSnackbar } from 'src/redux/uiSlice';
import { signTrip } from 'src/service/TripService';
import style from './SignForm.module.scss';

type Form = PutTripsSignRequest;

type TripsFormProps = { onClose: () => void; tripId?: string };

const SignForm = ({ onClose, tripId = 'xxx' }: TripsFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  const forWho = useWatch({ control, name: 'forWho' });
  const onSubmit: SubmitHandler<Form> = (data) => {
    onClose();
    signTrip(tripId, {
      ...data,
      line: data.line === '' ? undefined : data.line,
      yearOfBirth: format(new Date(data.yearOfBirth), 'yyyy'),
    })
      .then(() => {
        dispatch(openSnackbar({ severity: 'success', message: '已報名成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '報名失敗，請重試' }));
      });
  };

  return (
    <form className={style.self} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.hint}>* 為必填項目</div>
      <FormRadio
        control={control}
        name="forWho"
        defaultValue="self"
        items={[
          { value: 'self', label: '我自己要報名參加' },
          { value: 'kid', label: '幫小孩報名參加' },
        ]}
      />
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
        label="聯絡電話*"
        size="small"
        error={errors.phone !== undefined}
      />
      <FormInput control={control} name="line" label="LINE ID" size="small" />
      <FormInput
        formType="yearPicker"
        control={control}
        name="yearOfBirth"
        label={forWho === 'kid' ? '小孩的出生年(西元)*' : '出生年(西元)*'}
        rules={{ required: true }}
        helperText="此為避免同名同姓時識別用"
        size="small"
        error={errors.yearOfBirth !== undefined}
      />
      {forWho === 'kid' && (
        <FormCheckbox control={control} name="accompany" label="是否陪小孩同行" />
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

export default SignForm;
