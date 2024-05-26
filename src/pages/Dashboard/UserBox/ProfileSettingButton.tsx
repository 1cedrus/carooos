import { IconButton, Menu, MenuItem } from '@mui/material';
import { Settings02Icon } from '@/components/shared/icons.tsx';
import { useState } from 'react';
import { eventEmitter, EventName } from '@/utils/eventemitter.ts';

enum Items {
  ChangePassword = 'Change Password',
  ChangeEmail = 'Change Email',
}

const MENU_ITEMS = {
  [Items.ChangePassword]: EventName.OpenChangePasswordModal,
  [Items.ChangeEmail]: EventName.OpenChangeEmailModal,
};

export default function ProfileSettingButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: EventName) => {
    eventEmitter.emit(event);

    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Settings02Icon />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            border: '2px solid black',
            boxShadow: '0px -3px 0px 0px rgba(17,18,38,0.20) inset',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        {Object.entries(MENU_ITEMS).map(([item, event]) => (
          <MenuItem key={item} onClick={() => handleClose(event)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
