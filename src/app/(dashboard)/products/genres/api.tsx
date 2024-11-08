import { Genre } from '@/types/genres';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

interface SearchGenresData {
  genres: Genre[];
  count: number;
}

export const searchGenres = (query: Record<string, any>) => () =>
  appFetch<SearchGenresData>({
    url: '/genres/search',
    query,
    withAuth: true,
  });

export const useSearchGenresQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['genres', query],
    queryFn: searchGenres(query),
  });
};

export const useCreateGenre = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (values: any) =>
      appFetch({
        withAuth: true,
        url: `/genres`,
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
      }),
    onSuccess,
  });

export const useUpdateGenre = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        withAuth: true,
        url: `/genres/${id}`,
        config: {
          body: JSON.stringify(body),
          method: 'PUT',
        },
      }),
    onSuccess,
  });

export const useDeleteGenre = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (genreId: string) =>
      appFetch({
        withAuth: true,
        url: `/genres/${genreId}`,
        config: {
          method: 'DELETE',
        },
      }),
    onSuccess,
  });

export const useDeleteGenres = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (genreIds: string[]) =>
      appFetch({
        withAuth: true,
        url: `/genres`,
        config: {
          body: JSON.stringify({ ids: genreIds }),
          method: 'DELETE',
        },
      }),
    onSuccess,
  });
