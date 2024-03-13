import { IconButton, DialogTitle as MuiDialogTitle } from '@mui/material';
import { Props } from '@/types.ts';
import CloseIcon from '@mui/icons-material/Close';

interface DialogTitleProps extends Props {
  onClose?: () => void;
}

export default function DialogTitle({ children, onClose }: DialogTitleProps) {
  return (
    <MuiDialogTitle className='flex justify-between'>
      {children}
      {onClose && (
        <IconButton onClick={onClose} sx={{ p: '5px' }}>
          <CloseIcon sx={{ color: 'black' }} />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
}
