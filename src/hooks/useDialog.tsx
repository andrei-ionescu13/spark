import { useState } from 'react'

export const useDialog = (initialDialogOpen = false): [boolean, () => void, () => void] => {
  const [dialogOpen, setDialogOpen] = useState(initialDialogOpen);

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  }

  const handleCloseDialog = (): void => {
    setDialogOpen(false);
  }

  return [dialogOpen, handleOpenDialog, handleCloseDialog];
}