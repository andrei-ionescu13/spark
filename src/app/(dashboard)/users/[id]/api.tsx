import { User } from '@/types/user';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getUser =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<User>({
      url: `/users/${id}`,
      withAuth: true,
      ...config,
    });

export const useGetUser = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['users', id],
    queryFn: getUser(id),
  });
};
