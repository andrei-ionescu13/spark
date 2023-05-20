import type { FC } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { useCreateGenre, useUpdateGenre } from "@/api/genres";
import { Button } from "@/components/button";

interface GenreDialogProps {
  open: boolean;
  onClose: any;
  mode?: "create" | "edit";
  genre?: any;
}

export const GenreDialog: FC<GenreDialogProps> = (props) => {
  const { open, onClose, genre, mode = "create" } = props;
  const queryClient = useQueryClient();
  const createGenre = useCreateGenre(() =>
    queryClient.invalidateQueries("genres")
  );
  const updateGenre = useUpdateGenre(() =>
    queryClient.invalidateQueries("genres")
  );

  const formik = useFormik({
    initialValues: {
      name: genre?.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
    }),
    onSubmit: (values) => {
      if (mode === "create") {
        createGenre.mutate(values, {
          onSuccess: () => {
            queryClient.invalidateQueries("genres");
            onClose();
          },
        });

        return;
      }

      if (genre) {
        updateGenre.mutate(
          { id: genre._id, body: values },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("genres");
              onClose();
            },
          }
        );
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "create" ? "Add" : "Update"} genre</DialogTitle>
      <DialogContent sx={{ py: "24px !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              size="small"
              error={!!formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && (formik.errors.name as string)}
              fullWidth
              id="name"
              label="Genre"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={createGenre.isLoading || updateGenre.isLoading}
          onClick={() => {
            formik.handleSubmit();
          }}
          variant="contained"
        >
          {mode === "create" ? "Add" : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
