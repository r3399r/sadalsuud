import { Button } from '@mui/material';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import FormInput from 'src/component/FormInput';
import style from './CodeForm.module.scss';

type Form = { code: string };

type CodeFormProps = {
  setCode: (v: string) => void;
};

const CodeForm = ({ setCode }: CodeFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
  } = useForm<Form>();

  useEffect(() => {
    setFocus('code');
  }, [setFocus]);

  const onSubmit: SubmitHandler<Form> = (data) => {
    setCode(data.code);
  };

  return (
    <form className={style.self} onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        control={control}
        name="code"
        rules={{ required: true }}
        label="通行碼"
        type="number"
        size="small"
        error={errors.code !== undefined}
      />
      <Button variant="contained" type="submit">
        確定
      </Button>
    </form>
  );
};

export default CodeForm;
