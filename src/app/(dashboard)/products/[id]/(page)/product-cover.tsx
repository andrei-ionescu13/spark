import { Pencil as PencilIcon } from '@/icons/pencil';
import { Box, IconButton } from '@mui/material';
import Image from 'next/image';
import { ChangeEvent, useRef, useState, type FC } from 'react';

interface ImageUpdateProps {
  url: string;
  alt: string;
  onFileSelect: (file: File) => void;
}

export const ImageUpdate: FC<ImageUpdateProps> = (props) => {
  const inputRef = useRef<any>();
  const { url, alt, onFileSelect } = props;
  const [preview, setPreview] = useState('');

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setPreview(URL.createObjectURL(file satisfies Blob));
      onFileSelect(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        aspectRatio: '16 / 9',
      }}
    >
      <input
        onChange={handleFileSelect}
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg, image/jpg"
      />
      <Image
        src={preview || url}
        alt={alt}
        fill
        style={{
          objectFit: 'contain',
        }}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
        onClick={handleClick}
      >
        <PencilIcon />
      </IconButton>
    </Box>
  );
};
