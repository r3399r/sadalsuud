import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { deleteSignById, getSign, setTripMember } from 'src/service/TripService';
import CodeForm from './component/CodeForm';
import CommentInput from './component/CommentInput';

const TripDiscuss = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [code, setCode] = useState<string>();
  const [signs, setSigns] = useState<GetTripsIdSign>();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deletedId, setDeletedId] = useState<string>();

  useEffect(() => {
    loadSignList();
  }, [id, code]);

  const handleClick = (_e: MouseEvent<unknown>, id: string) => {
    if (selected.has(id)) setSelected((prev) => new Set([...prev].filter((v) => v !== id)));
    else setSelected((prev) => new Set(prev.add(id)));
  };

  const handleClickOpen = (id: string) => () => setDeletedId(id);

  const handleClose = () => setDeletedId(undefined);

  const onDelete = () => {
    setDeletedId(undefined);
    deleteSignById(deletedId ?? 'xxx')
      .then(() => {
        loadSignList();
        dispatch(openSnackbar({ severity: 'success', message: '刪除成功' }));
      })
      .catch(() => {
        dispatch(openSnackbar({ severity: 'error', message: '刪除失敗，請重試' }));
      });
  };

  const onButtonClick = () => {
    setTripMember(id ?? 'zzz', [...selected])
      .then(() => {
        loadSignList();
        dispatch(openSnackbar({ severity: 'success', message: '設定成功' }));
      })
      .catch((e: Error) => {
        let message: string;
        if (e.message === 'Unauthorized') message = '設定失敗，權限不足';
        else message = '設定失敗，請重試';
        dispatch(openSnackbar({ severity: 'error', message }));
      });
  };

  const loadSignList = () => {
    if (code !== undefined)
      getSign(id ?? 'zzz', code)
        .then((res) => setSigns(res))
        .catch(() => {
          dispatch(openSnackbar({ severity: 'error', message: '載入失敗，請重試' }));
        });
  };

  if (signs === undefined) return <CodeForm setCode={(v: string) => setCode(v)} />;

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="min-w-[900px]">
          <TableHead>
            <TableRow>
              <TableCell>名字</TableCell>
              <TableCell>聯絡方式</TableCell>
              <TableCell>出生年(歲)</TableCell>
              <TableCell>志工/星兒</TableCell>
              <TableCell>家長是否同行</TableCell>
              <TableCell>出遊</TableCell>
              <TableCell>報名時間</TableCell>
              <TableCell>備註</TableCell>
              <TableCell>刪除</TableCell>
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
                  {v.birthYear} ({differenceInYears(Date.now(), new Date(`${v.birthYear}/1/1`))}
                  歲)
                </TableCell>
                <TableCell>{v.isSelf ? '志工' : '星兒'}</TableCell>
                <TableCell>{v.isSelf ? '-' : v.accompany ? '是' : '否'}</TableCell>
                <TableCell>
                  {v.canJoin === null && <QuestionMarkIcon />}
                  {v.canJoin === true && <CheckIcon />}
                  {v.canJoin === false && <CloseIcon />}
                </TableCell>
                <TableCell>{format(new Date(v.dateCreated), 'yyyy/MM/dd HH:mm:ss')}</TableCell>
                <TableCell>
                  <CommentInput initialValue={v.comment ?? ''} id={v.id} />
                </TableCell>
                <TableCell>
                  <DeleteForeverIcon className="cursor-pointer" onClick={handleClickOpen(v.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button type="button" variant="contained" className="!mt-[10px]" onClick={onButtonClick}>
        設定出遊名單
      </Button>
      <Dialog open={deletedId !== undefined} onClose={handleClose}>
        <DialogTitle>刪除出遊</DialogTitle>
        <DialogContent>
          <DialogContentText>確定刪除此報名? 此動作不可回復。</DialogContentText>
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

export default TripDiscuss;
