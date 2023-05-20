import type { FC } from "react";
import { Typography, styled } from "@mui/material";
import { useDropzone } from "react-dropzone";

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

interface DropzoneProps {
  onDrop: any;
}

export const ImagesDropzone: FC<DropzoneProps> = (props) => {
  const { onDrop } = props;

  const { getRootProps, getInputProps, isFocused } = useDropzone({
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    onDrop: (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
  });

  return (
    <DropzoneRoot
      sx={{
        borderColor: isFocused ? "#fff" : undefined,
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Typography color="textPrimary" variant="body1" sx={{ py: 10 }}>
        Select the images
      </Typography>
    </DropzoneRoot>
  );
};
