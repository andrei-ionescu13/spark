import { ChangeEvent, FC, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import type { CustomFile } from "@/components/dropzone";
import {
  Box,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { ImagesDropzone } from "@/components/images-dropzone";
import { ProductImage } from "../product-image";
import { Product } from "@/types/products";
import { FileWithPath } from "react-dropzone";
import { useUpdateProductMedia } from "@/api/products";
import { useQueryClient } from "react-query";
import { buildFormData } from "@/utils/build-form-data";
import type { Image } from "@/types/common";
import { Button } from "@/components/button";

interface ProductFormProps {
  product: Product;
  open: boolean;
  onClose: any;
}

interface InitialValues {
  cover: Image | CustomFile;
  videos: string[];
  images: Array<Image | FileWithPath>;
  selectedImages: Array<string>;
}

const isFile = (file: any): file is FileWithPath =>
  typeof window !== "undefined" && file instanceof File;
const isImage = (file: any): file is Image => !!file?.public_id;

export const ProductMediaForm: FC<ProductFormProps> = (props) => {
  const { open, product, onClose } = props;
  const queryClient = useQueryClient();
  const updateProductMedia = useUpdateProductMedia(product._id);
  const [newVideo, setNewVideo] = useState("");
  const [newVideoError, setNewVideoError] = useState("");
  const newVideoSchema = Yup.string().required();
  const [resolutionError, setResolutionError] = useState<string | undefined>(
    undefined
  );

  const handleNewVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewVideoError("");
    setNewVideo(event.target.value);
  };

  const initialValues: InitialValues = {
    cover: product.cover || undefined,
    videos: product.videos || [],
    images: product.images || [],
    selectedImages:
      product.selectedImages.map((image: Image) => image?.public_id) || [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      cover: Yup.mixed()
        .test("resolution", "wrong resolution", () => !resolutionError)
        .required("Required"),
      images: Yup.array().of(Yup.mixed()).min(1).required(),
      selectedImages: Yup.array().of(Yup.mixed()).min(1).required(),
      videos: Yup.array().of(Yup.string().required()).min(1).required(),
    }),
    onSubmit: (values) => {
      const formValues: any = { ...values };
      formValues.images = values.images.map((image) =>
        isImage(image) ? image?.public_id : image
      );
      const formData = buildFormData(formValues);

      updateProductMedia.mutate(formData, {
        onSuccess: (updatedProduct) => {
          queryClient.setQueryData(["product", product._id], {
            ...product,
            ...updatedProduct,
          });
          onClose();
        },
      });
    },
  });

  const handleSelectImage = (file: FileWithPath | Image): void => {
    if (
      formik.values.selectedImages.includes(
        isFile(file) ? file.path || "" : file?.public_id
      )
    ) {
      formik.setFieldValue(
        "selectedImages",
        formik.values.selectedImages.filter((item: string | Image) => {
          return isFile(file) ? item !== file.path : item !== file?.public_id;
        })
      );
      return;
    }

    formik.setFieldValue("selectedImages", [
      ...formik.values.selectedImages,
      isFile(file) ? file.path : file?.public_id,
    ]);
  };

  const handleImageDelete = (file: FileWithPath | any) => {
    formik.setFieldValue(
      "images",
      formik.values.images.filter((item: FileWithPath | any) =>
        isFile(file)
          ? item.path !== file.path
          : item?.public_id !== file?.public_id
      )
    );
    formik.setFieldValue(
      "selectedImages",
      formik.values.selectedImages.filter((item) =>
        isFile(file) ? item !== file.path : item !== file?.public_id
      )
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Media</DialogTitle>
      <DialogContent sx={{ py: "24px !important" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="subtitle2">
              Cover
            </Typography>

            <Dropzone
              resolution={{ width: 1920, height: 1080 }}
              file={
                isImage(formik.values.cover)
                  ? formik.values.cover?.url
                  : formik.values.cover
              }
              onDrop={(file: any) => {
                formik.setFieldTouched("cover", true);
                formik.setFieldValue("cover", file);
              }}
              onError={(error: string) => {
                setResolutionError(error);
                formik.setFieldError("cover", error);
              }}
            />
            {!!formik.touched.cover && !!formik.errors.cover && (
              <FormHelperText error>
                {formik.errors.cover as string}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography color="textPrimary" variant="subtitle2">
              Videos
            </Typography>
            <FormikProvider value={formik}>
              <FieldArray
                name="videos"
                render={(arrayHelpers) => (
                  <>
                    <Grid container spacing={2}>
                      {formik.values.videos.map(
                        (video: string, index: number) => (
                          <Grid
                            item
                            xs={12}
                            key={index}
                            sx={{
                              display: "grid",
                              alignItems: "center",
                              gridTemplateColumns: "1fr auto",
                              gridAutoFlow: "column",
                              gap: 2,
                            }}
                          >
                            <TextField
                              fullWidth
                              id={`${arrayHelpers.name}[${index}]`}
                              name={`${arrayHelpers.name}[${index}]`}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              value={formik.values.videos[index]}
                              size="small"
                              disabled
                            />
                            <Button
                              color="error"
                              variant="text"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Delete
                            </Button>
                          </Grid>
                        )
                      )}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "grid",
                            alignItems: "center",
                            gridTemplateColumns: "1fr auto",
                            gridAutoFlow: "column",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            id="newVideo"
                            name="newVideo"
                            onChange={handleNewVideoChange}
                            value={newVideo}
                            size="small"
                          />
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={async () => {
                              try {
                                await newVideoSchema.validate(newVideo);
                                arrayHelpers.push(newVideo);
                                setNewVideo("");
                              } catch (error) {
                                setNewVideoError((error as Error).message);
                              }
                            }}
                          >
                            Add
                          </Button>
                        </Box>
                        {!!formik.errors.videos && (
                          <FormHelperText error>
                            {formik.errors.videos}
                          </FormHelperText>
                        )}
                        {!!newVideoError && (
                          <FormHelperText error>{newVideoError}</FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="textPrimary" variant="subtitle2">
                          Images
                        </Typography>
                        <ImagesDropzone
                          onDrop={(files: FileWithPath[]) => {
                            formik.setFieldValue("images", [
                              ...formik.values.images,
                              ...files,
                            ]);
                            formik.setFieldValue("selectedImages", [
                              ...formik.values.selectedImages,
                              ...files.map((file) => file.path),
                            ]);
                          }}
                        />
                        {!!formik.values.images.length && (
                          <Box
                            sx={{
                              mt: 5,
                              display: "grid",
                              gridTemplateColumns: "repeat(3, 1fr)",
                              gap: 2,
                            }}
                          >
                            {formik.values.images.map((item) => (
                              <ProductImage
                                image={
                                  isFile(item)
                                    ? URL.createObjectURL(item)
                                    : item.url
                                }
                                key={
                                  isFile(item)
                                    ? item.path || ""
                                    : item?.public_id
                                }
                                onDelete={() => {
                                  handleImageDelete(item);
                                }}
                                selected={formik.values.selectedImages.includes(
                                  isFile(item)
                                    ? item.path || ""
                                    : item?.public_id
                                )}
                                onSelect={() => {
                                  handleSelectImage(item);
                                }}
                              />
                            ))}
                          </Box>
                        )}
                        {!!formik.touched.images && !!formik.errors.images && (
                          <FormHelperText error>
                            {formik.errors.images as string}
                          </FormHelperText>
                        )}
                        {!formik.errors.images &&
                          !!formik.touched.selectedImages &&
                          !!formik.errors.selectedImages && (
                            <FormHelperText error>
                              {formik.errors.selectedImages}
                            </FormHelperText>
                          )}
                      </Grid>
                    </Grid>
                  </>
                )}
              />
            </FormikProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose} size="large" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          disabled={updateProductMedia.isLoading}
          onClick={() => {
            formik.handleSubmit();
          }}
          size="large"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
