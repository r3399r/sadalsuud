import { Button } from '@mui/material';
import { PostLoginRequest } from '@y-celestial/sadalsuud-service';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import FormInput from 'src/component/FormInput';
import { openSnackbar } from 'src/redux/uiSlice';
import { login } from 'src/service/AuthService';

type Form = PostLoginRequest;

const LoginForm = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => {
    login(data).catch(() => {
      dispatch(openSnackbar({ severity: 'error', message: '登入失敗' }));
    });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        className="flex w-[250px] flex-col items-center justify-center gap-[15px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <b>管理員登入</b>
        <FormInput
          control={control}
          name="account"
          rules={{ required: true }}
          label="帳號"
          size="small"
          error={errors.account !== undefined}
        />
        <FormInput
          control={control}
          name="password"
          rules={{ required: true }}
          label="密碼"
          type="password"
          size="small"
          error={errors.password !== undefined}
        />
        <Button variant="contained" type="submit">
          送出
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
