import { PostTripsRequest } from '@y-celestial/sadalsuud-service';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Button from 'src/component/Button';
import FormInput from 'src/component/FormInput';
import { openSnackbar } from 'src/redux/uiSlice';
import { registerTrip } from 'src/service/TripService';
import style from './TripsForm.module.scss';

type Form = PostTripsRequest;

type TripsFormProps = { onClose: () => void };

const TripsForm = ({ onClose }: TripsFormProps) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit: SubmitHandler<Form> = (data) => {
    registerTrip({
      ...data,
      ownerLine: data.ownerLine === '' ? undefined : data.ownerLine,
      fee: parseInt(String(data.fee)),
      other: data.other === '' ? undefined : data.other,
    })
      .then(() => {
        dispatch(openSnackbar({ severity: 'success', message: '已成功申請，等待審核' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '申請失敗，請重試。' }));
      });
  };

  return (
    <form className={style.self} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.hint}>* 為必填項目</div>
      <div className={style.head}>申請人資料</div>
      <div className={style.flex}>
        <FormInput
          control={control}
          name="ownerName"
          rules={{ required: true }}
          label="你的名字*"
          size="small"
          error={errors.ownerName !== undefined}
        />
        <FormInput
          control={control}
          name="ownerPhone"
          rules={{ required: true, pattern: /^[0-9]+$/i }}
          label="聯絡電話*"
          size="small"
          error={errors.ownerPhone !== undefined}
        />
        <FormInput control={control} name="ownerLine" label="LINE ID" size="small" />
      </div>
      <div className={style.head}>出遊資訊</div>
      <FormInput
        control={control}
        name="topic"
        rules={{ required: true }}
        label="標題*"
        size="small"
        error={errors.topic !== undefined}
      />
      <div className={style.flex}>
        <FormInput
          formType="datePicker"
          control={control}
          name="date"
          rules={{ required: true }}
          label="日期*"
          size="small"
          error={errors.date !== undefined}
        />
        <FormInput
          formType="timePicker"
          control={control}
          name="meetTime"
          rules={{ required: true }}
          label="開始時間*"
          size="small"
          error={errors.meetTime !== undefined}
        />
        <FormInput
          formType="timePicker"
          control={control}
          name="dismissTime"
          rules={{ required: true }}
          label="結束時間*"
          size="small"
          error={errors.dismissTime !== undefined}
        />
      </div>
      <div className={style.flex}>
        <FormInput
          control={control}
          name="region"
          rules={{ required: true }}
          label="主要活動區域*"
          size="small"
          error={errors.region !== undefined}
        />
        <FormInput
          control={control}
          name="meetPlace"
          rules={{ required: true }}
          label="集合地點*"
          size="small"
          error={errors.meetPlace !== undefined}
        />
        <FormInput
          control={control}
          name="dismissPlace"
          rules={{ required: true }}
          label="解散地點*"
          size="small"
          error={errors.dismissPlace !== undefined}
        />
      </div>
      <FormInput
        control={control}
        name="fee"
        rules={{ required: true }}
        type="number"
        label="大概花費*"
        helperText="若無花費請填 0"
        size="small"
        error={errors.fee !== undefined}
      />
      <FormInput
        control={control}
        name="ad"
        rules={{ required: true }}
        label="簡短活動內容*"
        helperText="此為宣傳用，大家都能看到，切勿提及太詳細的時間地點"
        size="small"
        multiline
        rows={2}
        error={errors.ad !== undefined}
      />
      <FormInput
        control={control}
        name="content"
        rules={{ required: true }}
        label="詳細活動內容*"
        helperText="此區只有實際參與活動的人會看到，寫得愈詳細愈好"
        size="small"
        multiline
        minRows={2}
        maxRows={5}
        error={errors.content !== undefined}
      />
      <FormInput
        control={control}
        name="other"
        label="其他注意事項"
        size="small"
        multiline
        minRows={2}
        maxRows={5}
      />
      <div className={style.flex}>
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

export default TripsForm;
