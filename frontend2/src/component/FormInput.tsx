import { DatePicker, LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField, TextFieldProps } from '@mui/material';
import { useCallback } from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FormInputProps<T> = TextFieldProps & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions;
  formType?: 'text' | 'datePicker' | 'timePicker';
};

const FormInput = <T extends FieldValues>({
  control,
  name,
  rules,
  formType = 'text',
  ...props
}: FormInputProps<T>) => {
  const render = useCallback(
    ({ field: { onChange, value } }) => {
      if (formType === 'timePicker')
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              value={value}
              onChange={onChange}
              ampm={false}
              renderInput={(params) => <TextField {...params} autoComplete="off" {...props} />}
            />
          </LocalizationProvider>
        );
      else if (formType === 'datePicker')
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={value}
              onChange={onChange}
              inputFormat="yyyy/MM/dd"
              mask="____/__/__"
              renderInput={(params) => <TextField {...params} autoComplete="off" {...props} />}
            />
          </LocalizationProvider>
        );
      else return <TextField onChange={onChange} value={value} autoComplete="off" {...props} />;
    },
    [props.error],
  );

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={'' as any}
      render={render}
    />
  );
};

export default FormInput;
