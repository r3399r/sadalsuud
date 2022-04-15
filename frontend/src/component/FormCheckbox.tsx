import { Checkbox, FormControlLabel } from '@mui/material';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FormCheckboxProps<T> = {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: boolean;
  rules?: RegisterOptions;
  label: string;
};

const FormCheckbox = <T extends FieldValues>({
  name,
  control,
  defaultValue = false,
  rules,
  label,
}: FormCheckboxProps<T>) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue as any}
    rules={rules}
    render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label={label} />}
  />
);

export default FormCheckbox;
