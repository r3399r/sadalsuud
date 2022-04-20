import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FlightIcon from '@mui/icons-material/Flight';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { GetTripsDetailResponse } from '@y-celestial/sadalsuud-service';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { deleteTripById, getDetailedTrips } from 'src/service/TripService';
import style from './TripList.module.scss';
import VerifyForm from './VerifyForm';

const TripList = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trips, setTrips] = useState<GetTripsDetailResponse>();
  const [deletedId, setDeletedId] = useState<string>();
  const [verifiedId, setVerifiedId] = useState<string>();

  const handleClickOpen = (id: string) => () => setDeletedId(id);

  const handleClose = () => setDeletedId(undefined);

  const onDelete = () => {
    deleteTripById(deletedId ?? 'xxx')
      .then(() => {
        dispatch(openSnackbar({ severity: 'success', message: '刪除成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '刪除失敗，請重試' }));
      })
      .finally(() => {
        setDeletedId(undefined);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getDetailedTrips()
      .then((res) => setTrips(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [deletedId, verifiedId]);

  return (
    <>
      <h1>出遊清單</h1>
      {isLoading && <Loader />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>日期</TableCell>
              <TableCell>主題</TableCell>
              <TableCell>報名數</TableCell>
              <TableCell>通行碼</TableCell>
              <TableCell>主辦人</TableCell>
              <TableCell>狀態</TableCell>
              <TableCell>建立時間</TableCell>
              <TableCell>上次更新</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {trips === undefined
              ? []
              : trips.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{format(new Date(v.date), 'yyyy/MM/dd')}</TableCell>
                    <TableCell>{v.topic}</TableCell>
                    <TableCell>{v.signs}</TableCell>
                    <TableCell>{v.code}</TableCell>
                    <TableCell>
                      {v.ownerName} {v.ownerPhone} {v.ownerLine}
                    </TableCell>
                    <TableCell>
                      {v.status === 'pending' && (
                        <QuestionMarkIcon
                          className={style.clickable}
                          onClick={() => setVerifiedId(v.id)}
                        />
                      )}
                      {v.status === 'pass' && (
                        <CheckIcon
                          className={style.clickable}
                          onClick={() => setVerifiedId(v.id)}
                        />
                      )}
                      {v.status === 'reject' && (
                        <CloseIcon
                          className={style.clickable}
                          onClick={() => setVerifiedId(v.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>{format(v.dateCreated ?? 0, 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                    <TableCell>{format(v.dateUpdated ?? 0, 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                    <TableCell>
                      <Link to={`/trips/${v.id}`} target="_blank">
                        <FlightIcon />
                      </Link>
                      <Link to={`/trips/${v.id}/discuss`} target="_blank">
                        <FactCheckIcon />
                      </Link>
                      <DeleteForeverIcon
                        className={style.clickable}
                        onClick={handleClickOpen(v.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={verifiedId !== undefined}>
        <>
          <VerifyForm id={verifiedId} onClose={() => setVerifiedId(undefined)} />
        </>
      </Modal>
      <Dialog open={deletedId !== undefined} onClose={handleClose}>
        <DialogTitle>刪除出遊</DialogTitle>
        <DialogContent>
          <DialogContentText>確定刪除此出遊? 此動作不可回復。</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button variant="contained" color="error" onClick={onDelete}>
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TripList;
