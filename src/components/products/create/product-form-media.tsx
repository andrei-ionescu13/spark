import { ChangeEvent, FC, useState } from "react";
import { Dropzone } from "@/components/dropzone";
import {
  Box,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import { FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { ImagesDropzone } from "@/components/images-dropzone";
import type { FileWithPath } from "react-dropzone";
import { ProductImage } from "../product-image";
import { Image } from "@/types/common";
import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";

const isImage = (file: any): file is Image => !!file?.public_id;

interface ProductFormMediaProps {
  onSubmit: any;
  onBack: any;
  product?: any;
}

export const ProductFormMedia: FC<ProductFormMediaProps> = (props) => {
  const { onBack, onSubmit, product } = props;
  const [newVideo, setNewVideo] = useState("");
  const [newVideoError, setNewVideoError] = useState("");
  const newVideoSchema = Yup.string().required();

  const handleNewVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewVideoError("");
    setNewVideo(event.target.value);
  };

  const formik = useFormik({
    initialValues: {
      cover: product?.cover || undefined,
      videos: product?.videos || [],
      images: product?.images || [],
      selectedImages: product?.selectedImages || [],
    },
    validationSchema: Yup.object({
      cover: Yup.mixed().required("Required"),
      images: Yup.array().of(Yup.mixed()).min(1).required(),
      selectedImages: Yup.array().of(Yup.mixed()).min(1).required(),
      videos: Yup.array().of(Yup.string().required()).min(1).required(),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleSelectImage = (file: FileWithPath): void => {
    if (formik.values.selectedImages.includes(file.path)) {
      formik.setFieldValue(
        "selectedImages",
        formik.values.selectedImages.filter(
          (item: string) => item !== file.path
        )
      );
      return;
    }

    formik.setFieldValue("selectedImages", [
      ...formik.values.selectedImages,
      file.path,
    ]);
  };

  const handleImageDelete = (file: FileWithPath) => {
    formik.setFieldValue(
      "images",
      formik.values.images.filter(
        (item: FileWithPath) => item.path !== file.path
      )
    );
    formik.setFieldValue(
      "selectedImages",
      formik.values.selectedImages.filter((item: string) => item !== file.path)
    );
  };
  console.log(formik.errors.cover);
  return (
    <Box>
      <Card>
        <CardContent>
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
                  formik.setFieldError("cover", undefined);
                }}
                onError={(error: string) => {
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
                                gridTemplateColumns: "90% 1fr",
                                gridAutoFlow: "column",
                                gap: 2,
                              }}
                            >
                              <TextInput
                                error={
                                  Array.isArray(formik.touched.videos) &&
                                  !!formik.touched.videos[index] &&
                                  Array.isArray(formik.errors.videos) &&
                                  !!formik.errors.videos[index]
                                }
                                fullWidth
                                helperText={
                                  Array.isArray(formik.touched.videos) &&
                                  formik.touched.videos[index] &&
                                  Array.isArray(formik.errors.videos) &&
                                  (formik.errors.videos[index] as string)
                                }
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
                            <TextInput
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
                          {!!formik.touched.videos &&
                            !!formik.errors.videos && (
                              <FormHelperText error>
                                {formik.errors.videos as string}
                              </FormHelperText>
                            )}
                          {!!newVideoError && (
                            <FormHelperText error>
                              {newVideoError}
                            </FormHelperText>
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
                              {formik.values.images.map(
                                (item: FileWithPath) => (
                                  <ProductImage
                                    image={URL.createObjectURL(item)}
                                    key={item.path}
                                    onDelete={() => {
                                      handleImageDelete(item);
                                    }}
                                    selected={formik.values.selectedImages
                                      .map((item: string) => item)
                                      .includes(item.path)}
                                    onSelect={() => {
                                      handleSelectImage(item);
                                    }}
                                  />
                                )
                              )}
                            </Box>
                          )}
                          {!!formik.touched.images &&
                            !!formik.errors.images && (
                              <FormHelperText error>
                                {formik.errors.images as string}
                              </FormHelperText>
                            )}
                          {!formik.errors.images &&
                            !!formik.touched.selectedImages &&
                            !!formik.errors.selectedImages && (
                              <FormHelperText error>
                                {formik.errors.selectedImages as string}
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
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button color="inherit" onClick={onBack} size="large" sx={{ mr: 1 }}>
          Back
        </Button>
        <Button onClick={() => formik.handleSubmit()} size="large">
          Next
        </Button>
      </Box>
    </Box>
  );
};
