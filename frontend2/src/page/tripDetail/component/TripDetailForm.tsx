import { GetTripsIdResponse } from '@y-celestial/sadalsuud-service';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import FormInput from 'src/component/FormInput';
import { openSnackbar } from 'src/redux/uiSlice';
import { getTripById } from 'src/service/TripService';
import style from './TripDetailForm.module.scss';

type Form = { code: string };

type TripDetailFormProps = {
  id: string;
  setTrip: Dispatch<SetStateAction<GetTripsIdResponse | undefined>>;
};

const TripDetailForm = ({ id, setTrip }: TripDetailFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => {
    getTripById(id, data.code)
      .then((res) => setTrip(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      });
  };

  return (
    <form className={style.self} onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        name="code"
        rules={{ required: true }}
        label="code"
        type="password"
        size="small"
        error={errors.code !== undefined}
      />
      <Button variant="contained" type="submit">
        確定
      </Button>
    </form>
  );
};

export default TripDetailForm;
