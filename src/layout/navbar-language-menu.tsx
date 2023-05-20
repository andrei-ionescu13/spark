import { useState, useRef } from 'react';
import type { FC } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { setCookies } from 'cookies-next';
import Image from 'next/image';

const NEXT_LOCALE = "NEXT_LOCALE";
const languageOptions = [
  {
    name: 'English',
    flag: 'us.svg',
    code: 'en'
  },
  {
    name: 'Dutch',
    flag: 'de.svg',
    code: 'de'
  },
  {
    name: 'French',
    flag: 'fr.svg',
    code: 'fr'
  },
  {
    name: 'Spanish',
    flag: 'es.svg',
    code: 'es'
  },
]

export const NavbarLanguageMenu: FC = () => {
  const router = useRouter();
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };


  const handleLanguageChange = (language: string): void => {
    setCookies(NEXT_LOCALE, language)
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale: language })
  }

  return (
    <div>
      <Button
        ref={buttonRef}
        onClick={handleOpen}
        color="primary"
        sx={{ minWidth: 'fit-content' }}
      >
        <Image
          src={`/flags/${languageOptions.find((option) => option.code === router.locale)?.flag}`}
          alt={languageOptions.find((option) => option.code === router.locale)?.name}
          width={24}
          height={18}
          layout="fixed"
          priority
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
      >
        {languageOptions.map((option) => (
          <MenuItem
            onClick={() => handleLanguageChange(option.code)}
            key={option.code}
          >
            <Image
              src={`/flags/${option.flag}`}
              alt={option.code}
              width={24}
              height={18}
              layout="fixed"
              priority
            />
            <Typography
              sx={{ ml: 1 }}
              color="textPrimary"
              variant="subtitle2"
            >
              {option.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}