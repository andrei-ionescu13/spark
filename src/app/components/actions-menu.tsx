import type { FC, ElementType } from "react";
import { Menu, MenuItem } from "@mui/material";
import type { MenuProps, MenuItemProps } from "@mui/material";
import { Link } from "./link";

export interface ActionsItem extends MenuItemProps {
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  href?: string;
  icon: ElementType;
  isLink?: boolean;
  label: string;
  onClick?: () => void;
}

interface IconActionMenuProps extends MenuProps {
  items: ActionsItem[];
  onClose: () => void;
}

export const ActionsMenu: FC<IconActionMenuProps> = (props) => {
  const { items, onClose } = props;

  return (
    <Menu
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    >
      {items.map(
        ({ label, icon: Icon, onClick, color, isLink, href, disabled }) =>
          isLink && href ? (
            <MenuItem
              component={Link}
              href={href}
              key={label}
              sx={{
                color,
                fontWeight: 500,
              }}
            >
              <Icon sx={{ mr: 1 }} />
              {label}
            </MenuItem>
          ) : (
            <MenuItem
              disabled={disabled}
              onClick={() => {
                onClick && onClick();
                onClose();
              }}
              key={label}
              sx={{
                color,
                fontWeight: 500,
              }}
            >
              <Icon sx={{ mr: 1 }} />
              {label}
            </MenuItem>
          )
      )}
    </Menu>
  );
};
