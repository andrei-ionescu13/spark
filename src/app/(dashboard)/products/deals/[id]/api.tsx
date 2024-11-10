import { Deal } from '@/types/deal';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getDeal = (id: string) => () =>
  appFetch<Deal>({
    url: `/deals/${id}`,
    withAuth: true,
  });

export const useGetDealQuery = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['deal', id],
    queryFn: getDeal(id),
    enabled: !!id,
  });
};

export const useUpdateDeal = (onSuccess: () => Promise<any>) =>
  useMutation<Deal, Error, { id: string; body: BodyInit }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/deals/${id}`,
        config: {
          body: body,
          method: 'PUT',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });
