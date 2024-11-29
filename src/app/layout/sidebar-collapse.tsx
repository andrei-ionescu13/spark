import { Box, Collapse, List, ListItem } from '@mui/material';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { Link } from '../components/link';
import { ChevronRight as ChevronRightIcon } from '../icons/chevron-right';
import type { Item } from './sidebar';
import { SidebarListItem } from './sidebar-collapse-item';
import { SidebarItem } from './sidebar-item';

interface SidebarCollapseProps {
  item: Item;
  onClick: any;
  open?: boolean;
}

export const SidebarCollapse: FC<SidebarCollapseProps> = (props) => {
  const { item, onClick, open = false } = props;
  const pathname = usePathname();
  const { icon: Icon } = item;

  const active = !!item?.subitems?.some((item) => pathname === item.href);

  return (
    <>
      <ListItem
        disableGutters
        disablePadding
      >
        <SidebarItem
          active={active}
          onClick={() => onClick(item.title)}
        >
          <Icon />
          {item.title}
          <Box sx={{ flexGrow: 1 }} />
          <ChevronRightIcon
            sx={{
              transform: open ? 'rotate(90deg)' : 'rotate(0)',
              transition: '300ms',
            }}
          />
        </SidebarItem>
      </ListItem>
      <Collapse in={open}>
        <List
          disablePadding
          sx={{ width: '100%' }}
        >
          {item?.subitems?.map((item) => (
            <ListItem
              disableGutters
              disablePadding
              key={item.title}
            >
              <SidebarListItem
                component={Link}
                href={item.href}
                sx={{ pl: 6 }}
              >
                {item.title}
              </SidebarListItem>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};
