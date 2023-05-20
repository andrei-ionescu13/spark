import { useState, useRef } from 'react';
import type { FC } from 'react';
import { ActionsMenu } from '@/components/actions-menu';
import type { ActionsItem } from '@/components/actions-menu';
import { ChevronDown as ChevronDownIcon } from '@/icons/chevron-down';
import { Button } from '@mui/material';

interface ActionsButtonProps {
  items: ActionsItem[];
  onClose?: () => void;
  onOpen?: () => void;
  isLoading?: boolean;
}

export const ActionsButton: FC<ActionsButtonProps> = (props) => {
  const { items, onOpen, onClose, isLoading } = props
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    if (onOpen) {
      onOpen();
    }

    setOpen(true);
  }

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    }
    setOpen(false);
  }

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        ref={buttonRef}
        disabled={isLoading}
      >
        Actions
        <ChevronDownIcon />
      </Button>
      <ActionsMenu
        items={items}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
      />
    </>
  )
}