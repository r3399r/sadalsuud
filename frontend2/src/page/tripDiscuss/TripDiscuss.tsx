import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { GetTripsIdSign } from '@y-celestial/sadalsuud-service';
import { differenceInYears, format } from 'date-fns';
import { MouseEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { openSnackbar } from 'src/redux/uiSlice';
import { getSign } from 'src/service/TripService';
import CodeForm from './component/CodeForm';
import CommentInput from './component/CommentInput';

const TripDiscuss = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [code, setCode] = useState<string>();
  const [signs, setSigns] = useState<GetTripsIdSign>();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (code !== undefined)
      getSign(id ?? 'zzz', code)
        .then((res) => setSigns(res))
        .catch(() => {
          dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
        });
  }, [id, code]);

  const handleClick = (_e: MouseEvent<unknown>, id: string) => {
    if (selected.has(id)) setSelected((prev) => new Set([...prev].filter((v) => v !== id)));
    else setSelected((prev) => new Set(prev.add(id)));
  };

  if (signs === undefined) return <CodeForm setCode={(v: string) => setCode(v)} />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>名字</TableCell>
            <TableCell>聯絡方式</TableCell>
            <TableCell>出生年(歲)</TableCell>
            <TableCell>志工/星兒</TableCell>
            <TableCell>家長是否同行</TableCell>
            <TableCell>報名時間</TableCell>
            <TableCell>備註</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {signs.map((v) => (
            <TableRow
              key={v.id}
              hover
              onClick={(e) => handleClick(e, v.id)}
              selected={selected.has(v.id)}
            >
              <TableCell>{v.name}</TableCell>
              <TableCell>
                {v.phone} {v.line}
              </TableCell>
              <TableCell>
                {v.yearOfBirth} ({differenceInYears(Date.now(), new Date(`${v.yearOfBirth}/1/1`))}
                歲)
              </TableCell>
              <TableCell>{v.isSelf ? '志工' : '星兒'}</TableCell>
              <TableCell>{v.isSelf ? '-' : v.accompany ? '是' : '否'}</TableCell>
              <TableCell>{format(v.dateCreated, 'yyyy/MM/dd HH:mm:ss')}</TableCell>
              <TableCell>
                <CommentInput initialValue={v.comment} id={v.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TripDiscuss;
