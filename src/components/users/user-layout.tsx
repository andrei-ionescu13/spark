import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import { Link } from '@/components/link';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import type { User } from '@/types/user';

interface Tab {
  label: string;
  href: string;
  pathname: string;
}

interface UserLayoutProps {
  children: ReactNode;
  user: User;
  isLoading?: boolean;
}

export const UserLayout: FC<UserLayoutProps> = (props) => {
  const { isLoading = false, user, children } = props;
  const router = useRouter();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] = useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] = useDialog(false);
  const [resetDialogOpen, handleOpenResetDialog, handleCloseResetDialog] = useDialog(false);
  const { _id: id, email } = user;

  const tabs: Tab[] = [
    {
      label: 'General',
      href: `/users/${id}`,
      pathname: `/users/[id]`,
    },
    {
      label: 'Orders',
      href: `/users/${id}/orders`,
      pathname: `/users/[id]/orders`,
    },
    {
      label: 'Reviews',
      href: `/users/${id}/reviews`,
      pathname: `/users/[id]/reviews`,
    },
  ]

  const actionItems: ActionsItem[] = [
    // {
    //   label: 'Send reset link',
    //   icon: KeyIcon,
    //   onClick: handleOpenResetDialog,
    // },
    // {
    //   label: 'Ban',
    //   icon: BanIcon,
    //   onClick: handleOpenBanDialog,
    // },
    // {
    //   label: 'Delete',
    //   icon: TrashIcon,
    //   onClick: handleOpenDeleteDialog,
    //   color: 'error.main'
    // }
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
            isActionsLoading={isLoading}
            isTitleLoading={isLoading}
          />
          <Tabs value={tabs.findIndex((tab) => tab.pathname === router.pathname)}>
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