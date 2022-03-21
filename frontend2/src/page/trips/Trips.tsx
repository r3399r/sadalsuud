import { Modal } from '@mui/material';
import { useState } from 'react';
import Button from 'src/component/Button';
import TripsForm from './component/TripsForm';
import style from './Trips.module.scss';

const Trips = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        申請出遊活動
      </Button>
      <Modal open={open}>
        <div className={style.modal}>
          <TripsForm onClose={() => setOpen(false)} />
        </div>
      </Modal>
    </>
  );
};

export default Trips;
