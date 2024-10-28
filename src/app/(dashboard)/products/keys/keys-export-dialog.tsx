import type { FC } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import type { DialogProps } from "@mui/material";
import { download } from '../../../utils/download';
import { appFetch } from '../../../utils/app-fetch';
import { Button } from '../../../components/button';

interface AlertDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
}

export const KeysExportDialog: FC<AlertDialogProps> = (props) => {
  const { open, onClose, ...rest } = props;

  const exportKeys = async () => {
    const blob = await appFetch({
      url: '/keys/export',
      responseType: 'blob',
      withAuth: true
    })
    download(blob, 'keys.json')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      {...rest}
    >
      <DialogTitle>
        Export keys
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <DialogContentText sx={{ mb: 1 }}>
          Select the format
        </DialogContentText>
        <Box
          sx={{
            display: 'grid',
            gridAutoFlow: 'column',
            gap: 2
          }}
        >
          <Button
            color="primary"
            variant="text"
            onClick={() => { exportKeys() }}
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