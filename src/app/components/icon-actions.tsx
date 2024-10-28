"use client"

import { useState, useRef } from 'react';
import type { FC } from 'react';
import { IconButton } from '@mui/material';
import { ActionsItem, ActionsMenu } from './actions-menu';
import { DotsVertical as DotsVerticalIcon } from '../icons/dots-vertical';

interface ActionsIconButtonProps {
  items: ActionsItem[];
  onClose?: () => void;
  onOpen?: () => void;
}

export const ActionsIconButton: FC<ActionsIconButtonProps> = (props) => {
  const { items, onOpen, onClose } = props
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
      <IconButton
        color="primary"
        onClick={handleOpen}
        ref={buttonRef}
      >
        <DotsVerticalIcon />
      </IconButton>
      <ActionsMenu
        items={items}
        open={open}
        anchorEl={buttonRef.current}
        onClose={handleClose}
      />
    </>
  )
}