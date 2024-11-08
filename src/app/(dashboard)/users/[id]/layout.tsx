'use client';

import { ActionsItem } from '@/components/actions-menu';
import { AlertDialog } from '@/components/alert-dialog';
import Link from '@/components/link';
import { PageHeader } from '@/components/page-header';
import { useDialog } from '@/hooks/useDialog';
import { Ban } from '@/icons/ban';
import { Key } from '@/icons/key';
import { Trash } from '@/icons/trash';
import { Box, Container, Divider, Tab, Tabs } from '@mui/material';
import Head from 'next/head';
import { useParams, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useGetUser } from './api';

interface Tab {
  label: string;
  href: string;
}

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout(props: UserLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useGetUser();
  const { children } = props;
  const pathname = usePathname();
  const [deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog] =
    useDialog(false);
  const [banDialogOpen, handleOpenBanDialog, handleCloseBanDialog] =
    useDialog(false);
  const [resetDialogOpen, handleOpenResetDialog, handleCloseResetDialog] =
    useDialog(false);
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
  ];

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
      color: 'error',
    },
  ];

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
      <Box sx={{ py: 3 }}>
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
}
