import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FormRadioProps<T> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions;

  items: { value: string; label: string }[];
  defaultValue?: string;
  row?: boolean;
};

const FormRadio = <T extends FieldValues>({
  name,
  control,
  rules,
  items,
  defaultValue,
  row = true,
}: FormRadioProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    defaultValue={defaultValue ?? ('' as any)}
    render={({ field }) => (
      <RadioGroup defaultValue={defaultValue} row={row} {...field}>
        {items.map((v, i) => (
          <FormControlLabel key={i} value={v.value} control={<Radio />} label={v.label} />
        ))}
      </RadioGroup>
    )}
  />
);

export default FormRadio;
