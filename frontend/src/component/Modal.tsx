import { ModalProps, Modal as MuiModal } from '@mui/material';

type Props = ModalProps & {
  handleClose: () => void;
  disableBackdropClick?: boolean;
};

const Modal = ({ open, handleClose, children, disableBackdropClick = false, ...props }: Props) => {
  const onMuiModalClose = (event: object, reason: string) => {
    if (!disableBackdropClick || reason !== 'backdropClick') handleClose();
  };

  return (
    <MuiModal open={open} onClose={onMuiModalClose} {...props}>
      <div className="relative left-1/2 top-1/2 box-border max-h-[80vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white outline-none md:w-[600px]">
        <div className="max-h-[calc(80vh-20px)] overflow-y-auto p-[10px]">{children}</div>
      </div>
    </MuiModal>
  );
};

export default Modal;
