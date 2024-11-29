'use client';
import { GlobeAlt } from '@/icons/globe-alt';
import {
  Avatar,
  Box,
  Card,
  Drawer,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useLayout } from 'app/(dashboard)/layout-context';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { Link } from '../components/link';
import { CurrencyDollar as CurrencyDollarIcon } from '../icons/currency-dollar';
import { Pencil as PencilIcon } from '../icons/pencil';
import { ShoppingCart as ShoppingCartIcon } from '../icons/shopping-cart';
import { Star as StarIcon } from '../icons/star';
import { Translate as TranslateIcon } from '../icons/translate';
import { Users as UsersIcon } from '../icons/users';
import { SidebarCollapse } from './sidebar-collapse';
import { SidebarItem } from './sidebar-item';

export interface Item {
  title: string;
  icon?: any;
  subitems?: Item[];
  href?: string;
}

interface SidebarProps {
  admin?: any;
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { admin } = props;
  const { sidebarOpen, handleSidebarClose } = useLayout();
  const pathname = usePathname();

  const items: Item[] = [
    {
      title: 'Dashboard',
      href: '/',
    },
    {
      title: 'Blog',
      icon: PencilIcon,
      subitems: [
        {
          title: 'List',
          href: '/articles',
        },
        {
          title: 'Create article',
          href: '/articles/create',
        },
        {
          title: 'Categories',
          href: '/articles/categories',
        },
        {
          title: 'Tags',
          href: '/articles/tags',
        },
      ],
    },
    {
      title: 'Internationalization',
      icon: GlobeAlt,
      subitems: [
        {
          title: 'Translations',
          href: '/namespaces',
        },
        {
          title: 'Languages',
          href: '/languages',
        },
      ],
    },
    {
      title: 'Products',
      icon: ShoppingCartIcon,
      subitems: [
        {
          title: 'List',
          href: '/products',
        },
        {
          title: 'Create',
          href: '/products/create',
        },
        {
          title: 'Deals',
          href: '/products/deals',
        },
        {
          title: 'Collections',
          href: '/products/collections',
        },
        {
          title: 'Platforms',
          href: '/products/platforms',
        },
        {
          title: 'Keys',
          href: '/products/keys',
        },
        {
          title: 'Publishers',
          href: '/products/publishers',
        },
        {
          title: 'Genres',
          href: '/products/genres',
        },
        {
          title: 'Developers',
          href: '/products/developers',
        },
        {
          title: 'Features',
          href: '/products/features',
        },
        {
          title: 'Operating Systems',
          href: '/products/operating-systems',
        },
      ],
    },
    {
      title: 'Discounts',
      icon: TranslateIcon,
      subitems: [
        {
          title: 'List',
          href: '/discounts',
        },
        {
          title: 'Create',
          href: '/discounts/create',
        },
      ],
    },
    {
      title: 'Promo codes',
      icon: TranslateIcon,
      subitems: [
        {
          title: 'List',
          href: '/promo-codes',
        },
        {
          title: 'Create',
          href: '/promo-codes/create',
        },
      ],
    },
    {
      title: 'Reviews',
      icon: StarIcon,
      href: '/reviews',
    },
    {
      title: 'Users',
      icon: UsersIcon,
      href: '/users',
    },
    {
      title: 'Orders',
      icon: ShoppingCartIcon,
      href: '/orders',
    },
    {
      title: 'Currencies',
      icon: CurrencyDollarIcon,
      href: '/currencies',
    },
  ];

  const [itemOpen, setitemOpen] = useState(
    items.find((item) => item?.subitems?.some((item) => pathname === item.href))
      ?.title
  );

  const handleClick = (title: string | undefined) => {
    if (itemOpen === title) {
      setitemOpen(undefined);
      return;
    }

    setitemOpen(title);
  };

  useEffect(() => {
    handleSidebarClose();
  }, [pathname]);

  const getContent = () => (
    <SimpleBar style={{ flex: 1, height: '100%' }}>
      <Box
        sx={{
          py: 2,
          flex: 1,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            mb: 4,
            px: 2,
            py: 1,
          }}
        >
          <Card
            elevation={0}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(145, 158, 171, 0.12)'
                  : '#252b37',
              alignItems: 'center',
              display: 'grid',
              gap: 1.5,
              gridAutoFlow: 'column',
              justifyContent: 'start',
              p: 2,
              width: '100%',
            }}
          >
            <Avatar
              alt="admin"
              src="https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/b2/b2a734431d40a6c110b7c09b1b3b65ad5819c79f.jpg"
            />
            <Box sx={{ textTransform: 'capitalize' }}>
              <Typography
                sx={{ fontWeight: 600 }}
                variant="subtitle1"
                color="textPrimary"
              >
                {admin?.username}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {admin?.role}
              </Typography>
            </Box>
          </Card>
        </Box>
        <Box sx={{ px: 2 }}>
          <List disablePadding>
            {items.map(({ icon: Icon, ...item }) =>
              !!item.subitems ? (
                <SidebarCollapse
                  open={itemOpen === item.title}
                  onClick={handleClick}
                  key={item.title}
                  item={{
                    ...item,
                    icon: Icon,
                  }}
                />
              ) : (
                <ListItem
                  key={item.title}
                  disableGutters
                  disablePadding
                >
                  <SidebarItem
                    component={Link}
                    href={item.href}
                    active={pathname === item.href}
                  >
                    {Icon ? <Icon /> : <Box sx={{ minWidth: 20 }} />}
                    {item.title}
                  </SidebarItem>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Box>
    </SimpleBar>
  );

  return (
    <>
      <Drawer
        sx={{
          width: 270,
          display: {
            xs: 'none',
            lg: 'block',
          },
          position: 'fixed',
          zIndex: 1200,
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            width: 270,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
        variant="permanent"
      >
        {getContent()}
      </Drawer>
      <Drawer
        sx={{
          width: 270,
          display: {
            xs: 'block',
            lg: 'none',
          },
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            width: 270,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
        variant="temporary"
        open={sidebarOpen}
        onClose={handleSidebarClose}
      >
        {getContent()}
      </Drawer>
    </>
  );
};
