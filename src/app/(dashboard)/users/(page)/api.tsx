'use client';

import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { User } from '@/types/user';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';

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
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['users', query],
    queryFn: searchUsers(query),
  });
};
