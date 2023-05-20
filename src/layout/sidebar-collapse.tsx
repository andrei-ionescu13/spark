import { alpha, Box, Collapse, List, ListItem } from "@mui/material";
import { useRouter } from "next/router";
import type { FC } from "react";
import type { Item } from "./sidebar";
import { SidebarItem } from "./sidebar-item";
import { SidebarListItem } from "./sidebar-collapse-item";
import { ChevronRight as ChevronRightIcon } from "@/icons/chevron-right";
import { Link } from "@/components/link";

interface SidebarCollapseProps {
  item: Item;
  onClick: any;
  open?: boolean;
}

export const SidebarCollapse: FC<SidebarCollapseProps> = (props) => {
  const { item, onClick, open = false } = props;
  const router = useRouter();
  const { icon: Icon } = item;

  const active = !!item?.subitems?.some(
    (item) => router.pathname === item.href
  );

  return (
    <>
      <ListItem disableGutters disablePadding>
        <SidebarItem active={active} onClick={() => onClick(item.title)}>
          <Icon sx={{ mr: 1.5 }} />
          {item.title}
          <Box sx={{ flexGrow: 1 }} />
          <ChevronRightIcon
            sx={{
              transform: open ? "rotate(90deg)" : "rotate(0)",
              transition: "300ms",
            }}
          />
        </SidebarItem>
      </ListItem>
      <Collapse in={open}>
        <List disablePadding sx={{ width: "100%" }}>
          {item?.subitems?.map((item) => (
            <ListItem disableGutters disablePadding key={item.title}>
              <SidebarListItem component={Link} href={item.href} sx={{ pl: 6 }}>
                {item.title}
              </SidebarListItem>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};
