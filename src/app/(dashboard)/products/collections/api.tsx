import { Collection } from '@/types/collection';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useDeleteCollection = () =>
  useMutation<Collection, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/collections/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
  });

export const useDeactivateCollection = () =>
  useMutation<Collection, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/collections/${id}/deactivate`,
        config: { method: 'PUT' },
        withAuth: true,
      }),
  });
