import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <MuiButton
      variant='outlined'
      sx={{ borderColor: 'black', color: 'black', '&:hover': { borderColor: 'black' } }}
      {...props}>
      {children}
    </MuiButton>
  );
}
