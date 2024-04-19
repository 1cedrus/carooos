import { Box, Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  textClassName?: string;
}

export default function Button({ children, className, textClassName, ...props }: ButtonProps) {
  return (
    <MuiButton
      variant='outlined'
      sx={{ bgcolor: 'white', borderColor: 'black', color: 'black', '&:hover': { bgcolor: 'white' } }}
      className={className}
      {...props}>
      <Box className={textClassName}>{children}</Box>
    </MuiButton>
  );
}
