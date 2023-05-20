import type { FC } from 'react';
import { InputAdornment, TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { Search as SearchIcon } from '@/icons/search';

export const SearchInput: FC<TextFieldProps> = (props) => (
  <TextField
    fullWidth
    id="query"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" >
          <SearchIcon sx={{ color: "text.secondary" }} />
        </InputAdornment>
      )
    }}
    variant="outlined"
    {...props}
  />
);
