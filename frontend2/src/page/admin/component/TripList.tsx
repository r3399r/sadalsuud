import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreIcon from '@mui/icons-material/More';
import {
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
import Loader from 'src/component/Loader';
import { openSnackbar } from 'src/redux/uiSlice';
import { getDetailedTrips } from 'src/service/TripService';

const TripList = () => {
  const dispatch = useDispatch();
  const [trips, setTrips] = useState<GetTripsDetailResponse>();

  useEffect(() => {
    getDetailedTrips()
      .then((res) => setTrips(res))
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
      });
  }, []);

  return (
    <>
      <h1>出遊清單</h1>
      {trips === undefined && <Loader />}
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
                    <TableCell>{v.date}</TableCell>
                    <TableCell>{v.topic}</TableCell>
                    <TableCell>{v.signs}</TableCell>
                    <TableCell>{v.code}</TableCell>
                    <TableCell>
                      {v.ownerName} {v.ownerPhone} {v.ownerLine}
                    </TableCell>
                    <TableCell>{v.status}</TableCell>
                    <TableCell>{format(v.dateCreated, 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                    <TableCell>{format(v.dateUpdated, 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                    <TableCell>
                      {v.status === 'pending' && <CheckIcon />}
                      {v.status === 'pending' && <CloseIcon />}
                      <MoreIcon />
                      <MeetingRoomIcon />
                      <DeleteForeverIcon />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TripList;
