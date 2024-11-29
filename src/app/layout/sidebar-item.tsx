import type { ButtonProps } from '@mui/material';
import { alpha, Button, styled } from '@mui/material';
import type { ElementType, FC } from 'react';

interface SidebarItemProps extends ButtonProps {
  active?: boolean;
  component?: ElementType;
}

const SidebarItemRoot = styled(({ active, ...props }: SidebarItemProps) => (
  <Button {...props} />
))<SidebarItemProps>(({ theme, active }) => {
  const activeStyles = {
    backgroundColor: alpha(theme.palette.primary.main, 0.082),
    color: theme.palette.primary.main,
    fontWeight: 600,
  };

  return {
    fontWeight: 'normal',
    justifyContent: 'flex-start',
    gap: theme.spacing(1.5),
    color: theme.palette.text.secondary,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    '&:hover': {
      backgroundColor: 'rgba(145, 158, 171, 0.12)',
      ...(active && activeStyles),
    },
    ...(active && activeStyles),
  };
});

export const SidebarItem: FC<SidebarItemProps> = (props) => {
  const { active = false, ...rest } = props;

  return (
    <SidebarItemRoot
      active={active}
      fullWidth
      {...rest}
    />
  );
};
