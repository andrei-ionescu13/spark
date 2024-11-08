import type { DialogProps } from '@mui/material';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { FC } from 'react';
import { Button } from '../../../components/button';

interface AlertDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeysExportDialog: FC<AlertDialogProps> = (props) => {
  const { open, onClose, ...rest } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      {...rest}
    >
      <DialogTitle>Export keys</DialogTitle>
      <DialogContent
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <DialogContentText sx={{ mb: 1 }}>Select the format</DialogContentText>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: 2,
          }}
        >
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              exportKeys();
            }}
          >
            JSON
          </Button>
          <Button
            color="primary"
            variant="text"
          >
            CSV
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
