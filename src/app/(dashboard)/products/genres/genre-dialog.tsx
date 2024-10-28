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
import { useQueryClient } from "@tanstack/react-query";
import { useCreateGenre, useUpdateGenre } from "@/api/genres";
import { Button } from "../../button";
import { TextInput } from "../../text-input";
import { Genre } from "../../../types/genres";

interface GenreDialogProps {
  open: boolean;
  onClose: any;
  mode?: "create" | "edit";
  genre?: Genre;
}

export const GenreDialog: FC<GenreDialogProps> = (props) => {
  const { open, onClose, genre, mode = "create" } = props;
  const queryClient = useQueryClient();
  const createGenre = useCreateGenre(() =>
    queryClient.invalidateQueries({ queryKey: ["genres"] })
  );
  const updateGenre = useUpdateGenre(() =>
    queryClient.invalidateQueries({ queryKey: ["genres"] })
  );

  const formik = useFormik({
    initialValues: {
      name: genre?.name || "",
      slug: genre?.slug || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      slug: Yup.string().max(255),
    }),
    onSubmit: (values) => {
      if (mode === "create") {
        createGenre.mutate(values, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] });
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
              queryClient.invalidateQueries({ queryKey: ["genres"] });
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
            <TextInput
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
          <Grid item xs={12}>
            <TextInput
              info="If a slug is not provided, one will be generated"
              size="small"
              error={!!formik.touched.slug && !!formik.errors.slug}
              helperText={formik.touched.slug && (formik.errors.slug as string)}
              fullWidth
              id="slug"
              label="Slug"
              name="slug"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.slug}
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
          isLoading={createGenre.isPending || updateGenre.isPending}
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
