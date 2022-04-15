import { Backdrop, CircularProgress } from '@mui/material';

type LoaderProps = {
  open?: boolean;
};

const Loader = ({ open = true }: LoaderProps) => (
  <Backdrop open={open}>
    <CircularProgress />
  </Backdrop>
);

export default Loader;
