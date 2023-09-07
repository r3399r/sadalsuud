import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';
import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'src/redux/uiSlice';
import { editSignComment } from 'src/service/TripService';

type CommentInputProps = {
  initialValue?: string;
  id: string;
};

const CommentInput = ({ initialValue = '', id }: CommentInputProps) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onClick = () => {
    if (value !== initialValue)
      editSignComment(id, value)
        .then(() => {
          dispatch(openSnackbar({ severity: 'success', message: '儲存成功' }));
        })
        .catch(() => {
          dispatch(openSnackbar({ severity: 'error', message: '儲存失敗，請重試' }));
        });
  };

  return (
    <div className="flex items-center gap-1">
      <TextField variant="standard" size="small" multiline value={value} onChange={onChange} />
      <EditIcon
        className={classNames({ 'cursor-pointer': value !== initialValue })}
        fontSize="small"
        color={value === initialValue ? 'disabled' : 'inherit'}
        onClick={onClick}
      />
    </div>
  );
};

export default CommentInput;
