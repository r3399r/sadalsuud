import { Button, Modal } from '@mui/material';
import { PostTripsRequest } from '@y-celestial/sadalsuud-service';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'src/redux/uiSlice';
import { registerTrip } from 'src/service/TripService';
import style from './Trips.module.scss';
import TripsForm from './TripsForm';

const Trips = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    registerTrip({
      ownerName: 'string',
      ownerPhone: 'string',
      ownerLine: 'string',
      date: '1',
      region: 'string',
      meetTime: 'string',
      meetPlace: 'string',
      dismissTime: 'string',
      dismissPlace: 'string',
      topic: 'string',
      ad: 'string',
      content: 'string',
      fee: 5,
      other: 'aa',
    } as PostTripsRequest)
      .then(() => {
        dispatch(openSnackbar({ severity: 'success', message: '已成功申請，等待審核' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '申請失敗，請重試' }));
      });
  }, []);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        申請出遊活動
      </Button>
      <Modal open={open}>
        <div className={style.modal} onClick={() => setOpen(false)}>
          <TripsForm />
        </div>
      </Modal>
    </>
  );
};

export default Trips;
