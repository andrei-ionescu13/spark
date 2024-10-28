import type { FC, ReactNode } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { DialogProps } from "@mui/material";
import { Button } from "./button";

export interface AlertDialogProps extends DialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: any;
  title: string;
  content?: string;
  isLoading: boolean;
  children?: ReactNode;
}

export const AlertDialog: FC<AlertDialogProps> = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    title,
    content,
    children,
    isLoading,
    ...rest
  } = props;

  const handleSubmit = (): void => {
    onSubmit();
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth {...rest}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content && <DialogContentText>{content}</DialogContentText>}
        {children}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          autoFocus
          color="primary"
          isLoading={isLoading}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
