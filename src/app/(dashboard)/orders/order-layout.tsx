import type { FC, ReactNode } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { Link } from '../../components/link';
import { PageHeader } from '../../components/page-header';
import { useGetOrder } from 'app/(dashboard)/orders/api-calls-hooks';

interface Tab {
  label: string;
  href: string;
  pathname: string;
}

interface ProductLayoutProps {
  children: ReactNode;
}

export const OrderLayout: FC<ProductLayoutProps> = (props) => {
  const { children } = props;
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const pathname = usePathname();

  const tabs: Tab[] = [
    {
      label: 'Summary',
      href: `/orders/${orderNumber}`,
      pathname: '/orders/[orderNumber]',

    },
    {
      label: 'Items',
      href: `/orders/${orderNumber}/items`,
      pathname: '/orders/[orderNumber]/items',
    }
  ]

  return (
    <>
      <Box sx={{ py: 3 }} >
        <Container maxWidth="lg">
          <PageHeader
            title={`Order ${orderNumber}`}
            backHref="/orders"
            backLabel="Orders"
          />
          <Tabs value={tabs.findIndex((tab) => tab.href === pathname)}>
            {tabs.map((tab) => (
              <Tab
                underline="none"
                component={Link}
                key={tab.label}
                href={tab.href}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider sx={{ mb: 3 }} />
          {children}
        </Container>
      </Box>
    </>
  );
};