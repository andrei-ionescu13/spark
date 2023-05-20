import { useRef } from 'react';
import type { FC } from 'react';
import {
  MenuItem,
  Typography,
  Checkbox,
  Menu,
  Button
} from '@mui/material';
import { useDialog } from '@/hooks/useDialog';
import 'simplebar/dist/simplebar.min.css';

export interface CheckboxMenuOption {
  label: string;
  value: string;
}

interface CheckboxMenuProps {
  options: CheckboxMenuOption[];
  onSelect: any;
  buttonLabel: string;
  optionsKey: string;
  verifyIsChecked: any;
}

export const CheckboxMenu: FC<CheckboxMenuProps> = (props) => {
  const { options, onSelect, buttonLabel, optionsKey, verifyIsChecked } = props
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, handleOpen, handleClose] = useDialog();

  return (
    <>
      <Button
        onClick={handleOpen}
        ref={buttonRef}
        color="secondary"
        variant="text"
      >
        {buttonLabel}
      </Button>
      <Menu
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 260
          }
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              px: 1,
            }}
            onClick={() => onSelect(optionsKey, option.value)}
          >
            <Checkbox checked={verifyIsChecked(optionsKey, option.value)} />
            <Typography
              color="textPrimary"
              variant="body2"
            >
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}