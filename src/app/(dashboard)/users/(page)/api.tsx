'use client';

import { User } from '@/types/user';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SearchUsersData {
  users: User[];
  count: number;
}

export const searchUsers =
  (query: Record<string, any>, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchUsersData>({
      url: '/users/search',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchUsers = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['users', query],
    queryFn: searchUsers(query),
  });
};
