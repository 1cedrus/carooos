import { Box, Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  textClassName?: string;
}

export default function Button({ children, className, textClassName, ...props }: ButtonProps) {
  return (
    <MuiButton
      variant='outlined'
      sx={{ bgcolor: 'white', borderColor: 'black', color: 'black', '&:hover': { bgcolor: 'white' } }}
      className={'shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'}
      {...props}>
      <Box className={textClassName}>{children}</Box>
    </MuiButton>
  );
}
