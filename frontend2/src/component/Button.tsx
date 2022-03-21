import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

type ButtonProps = MuiButtonProps;

const Button = ({ children, ...props }: ButtonProps) => (
  <MuiButton {...props}>{children}</MuiButton>
);

export default Button;
