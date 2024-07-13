import { appFetch } from "@/utils/app-fetch";
import type { Genre } from "@/types/genres";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useListGenres = () => useQuery({
  queryKey: ['genres'],
  queryFn: () => appFetch<Genre[]>({ url: '/genres', withAuth: true })
});

export const useCreateGenre = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (values: any) => appFetch({
    withAuth: true,
    url: `/genres`,
    config: {
      body: JSON.stringify(values),
      method: 'POST',
    },
  }),
  onSuccess
});

export const useUpdateGenre = (onSuccess: () => Promise<any>) => useMutation<{}, Error, { id: string, body: Record<string, any> }>({
  mutationFn: ({ id, body }) => appFetch({
    withAuth: true,
    url: `/genres/${id}`,
    config: {
      body: JSON.stringify(body),
      method: 'PUT',
    },
  }),
  onSuccess
});

export const useDeleteGenre = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (genreId: string) => appFetch({
    withAuth: true,
    url: `/genres/${genreId}`,
    config: {
      method: 'DELETE'
    },
  }),
  onSuccess
});

export const useDeleteGenres = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (genreIds: string[]) => appFetch({
    withAuth: true,
    url: `/genres`,
    config: {
      body: JSON.stringify({ ids: genreIds }),
      method: 'DELETE'
    },
  }),
  onSuccess
});
