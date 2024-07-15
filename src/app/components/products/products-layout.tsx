import type { FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Container, Divider, Tab, Tabs } from '@mui/material';
import { PageHeader } from '../page-header';
import { Link } from '../link';

interface Tab {
  href: string;
  label: string;
}

const tabs = [
  {
    label: 'Games',
    href: '/products',
  },
  {
    label: 'Bundles',
    href: '/products/bundles',
  }
]

interface ProductsLayoutProps {
  children: ReactNode;
}

export const ProductsLayout: FC<ProductsLayoutProps> = (props) => {
  const { children } = props;
  const { pathname } = useRouter();

  return (
    <Box sx={{ py: 3 }} >
      <Container maxWidth={false}>
        <PageHeader
          title="Products"
        />
        <Card>
          <Tabs
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            value={tabs.findIndex((tab) => tab.href === pathname)}
          >
            {tabs.map((tab) => (
              <Tab
                component={Link}
                href={tab.href}
                key={tab.href}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider />
          {children}
        </Card>
      </Container>
    </Box>
  );
};