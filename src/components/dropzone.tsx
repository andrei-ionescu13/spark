import { useState } from "react";
import type { FC } from "react";
import { Box, Typography, styled, CircularProgress } from "@mui/material";
import { FileWithPath, useDropzone } from "react-dropzone";
import Image from "next/image";

const DropzoneRoot = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(1),
  borderWidth: 1,
  borderRadius: 8,
  borderColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.23)"
      : "rgba(0, 0, 0, 0.23)",
  borderStyle: "dashed",
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "#F5F5F5",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "#EBEBEB",
  },
}));

export interface CustomFile extends FileWithPath {
  preview: string;
}

interface DropzoneProps {
  file?: string | CustomFile;
  onDrop: any;
  resolution?: {
    width: number;
    height: number;
  };
  onError?: (error: string) => void;
}

export const isFile = (file: any): file is CustomFile =>
  typeof window !== "undefined" && file instanceof File;

export const Dropzone: FC<DropzoneProps> = (props) => {
  const { file, onDrop, resolution, onError } = props;
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isFocused } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      (async () => {
        onDrop(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        if (isFile(file) && resolution && onError) {
          setIsLoading(true);
          await new Promise((res) => {
            const img = new window.Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              if (
                resolution?.width !== img.naturalWidth ||
                resolution?.height !== img.naturalHeight
              ) {
                onError("wrong resolution");
              }
              res(img);
            };
          });

          setIsLoading(false);
        }
      })();
    },
  });

  return (
    <DropzoneRoot
      sx={{ borderColor: isFocused ? "#fff" : undefined }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {!!file ? (
        <Box
          sx={{
            display: "block",
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "block",
              width: "100%",
              opacity: isLoading ? 0.2 : 1,
              minHeight: 202,
            }}
          >
            <Image
              alt=""
              src={isFile(file) ? file?.preview : file}
              width={resolution?.width}
              height={resolution?.height}
              priority
              layout={resolution ? "responsive" : "fill"}
              objectFit="contain"
            />
          </Box>
          {isLoading && (
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                height: "100%",
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "100%",
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="textPrimary" variant="body1" sx={{ py: 10 }}>
          Select the cover
        </Typography>
      )}
    </DropzoneRoot>
  );
};
