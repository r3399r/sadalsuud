import { DatePicker, LocalizationProvider, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField, TextFieldProps } from '@mui/material';
import zhLocale from 'date-fns/locale/zh-TW';
import { useCallback } from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FormInputProps<T> = TextFieldProps & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions;
  formType?: 'text' | 'datePicker' | 'timePicker' | 'yearPicker';
  minDate?: Date;
};

const FormInput = <T extends FieldValues>({
  name,
  control,
  rules,
  formType = 'text',
  minDate,
  ...props
}: FormInputProps<T>) => {
  const render = useCallback(
    ({ field: { onChange, value } }) => {
      if (formType === 'timePicker')
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhLocale}>
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
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhLocale}>
            <DatePicker
              value={value}
              onChange={onChange}
              inputFormat="yyyy/MM/dd"
              mask="____/__/__"
              minDate={minDate}
              renderInput={(params) => <TextField {...params} autoComplete="off" {...props} />}
            />
          </LocalizationProvider>
        );
      else if (formType === 'yearPicker')
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={zhLocale}>
            <DatePicker
              value={value}
              onChange={onChange}
              views={['year']}
              renderInput={(params) => <TextField {...params} autoComplete="off" {...props} />}
            />
          </LocalizationProvider>
        );
      else return <TextField onChange={onChange} value={value} autoComplete="off" {...props} />;
    },
    [props.error, props.label],
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
