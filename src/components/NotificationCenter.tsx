import { IconButton } from '@mui/material';
import NotificationIcon from '@/components/icons/NotificationIcon.tsx';

export default function NotificationCenter() {
  return (
    <IconButton
      className='invisible shadow-[0px_-3px_0px_0px_rgba(17,18,38,0.20)_inset]'
      sx={{ border: '1px solid black' }}>
      <NotificationIcon />
    </IconButton>
  );
}
