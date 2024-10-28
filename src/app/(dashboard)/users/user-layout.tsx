import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Divider,
  Link,
  Tab,
  Tabs
} from '@mui/material';
import { ActionsItem } from '../actions-menu';
import { AlertDialog } from '../alert-dialog';
import { PageHeader } from '../page-header';
import { useDialog } from '../../hooks/useDialog';
import type { User } from '../../types/user';
import { useGetUser } from 'app/(dashboard)/users/api-calls-hooks';
import { Key } from '@/icons/key';
import { Ban } from '@/icons/ban';
import { Trash } from '@/icons/trash';

interface Tab {
  label: string;
  href: string;
}

interface UserLayoutProps {
  children: ReactNode;
}

export const UserLayout: FC<UserLayoutProps> = (props) => {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useGetUser();
  const { children } = props;
  const pathname = usePathname();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] = useDialog(false);
  const [resetDialogOpen, handleOpenResetDialog, handleCloseResetDialog] = useDialog(false);
  const { email } = user || {};

  const tabs: Tab[] = [
    {
      label: 'General',
      href: `/users/${id}`,
    },
    {
      label: 'Orders',
      href: `/users/${id}/orders`,
    },
    {
      label: 'Reviews',
      href: `/users/${id}/reviews`,
    },
  ]

  const actionItems: ActionsItem[] = [
    {
      label: 'Send reset link',
      icon: Key,
      onClick: handleOpenResetDialog,
    },
    {
      label: 'Ban',
      icon: Ban,
      onClick: handleOpenBanDialog,
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: handleOpenDeleteDialog,
      color: 'error'
    }
  ]

  return (
    <>
      {!!id && (
        <>
          <AlertDialog
            open={deleteDialogOpen}
            onClose={handleCloseDeleteDialog}
            title={`Delete user ${id}`}
            content="Are you sure you want to permanently delete this user?"
            onSubmit={deleteDialogOpen}
            isLoading={false}
          />
          <AlertDialog
            open={banDialogOpen}
            onClose={handleCloseBanDialog}
            title={`Ban user ${id}`}
            content="Are you sure you want to ban this user?"
            onSubmit={banDialogOpen}
            isLoading={false}
          />
          <AlertDialog
            open={resetDialogOpen}
            onClose={handleCloseResetDialog}
            title={`Reset link`}
            content="Are you sure you want to send a reset link?"
            onSubmit={resetDialogOpen}
            isLoading={false}
          />
        </>
      )}
      <Head>
        <title>User</title>
      </Head>
      <Box sx={{ py: 3 }} >
        <Container maxWidth="lg">
          <PageHeader
            title={email}
            backHref="/users"
            backLabel="Users"
            actions={actionItems}
            isLoading={isLoading}
          />
          <Tabs value={tabs.findIndex((tab) => tab.href === pathname)}>
            {tabs.map((tab) => (
              <Tab
                component={Link}
                key={tab.label}
                href={tab.href}
                label={tab.label}
                underline="none"
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