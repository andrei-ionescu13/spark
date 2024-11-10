import { Deal } from '@/types/deal';
import { appFetch } from '@/utils/app-fetch';
import { useMutation } from '@tanstack/react-query';

export const useDeleteDeal = () =>
  useMutation<Deal, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/deals/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
  });

export const useDeactivateDeal = () =>
  useMutation<Deal, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/deals/${id}/deactivate`,
        config: { method: 'PUT' },
        withAuth: true,
      }),
  });
