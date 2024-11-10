import { Collection } from '@/types/collection';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getCollection = (id: string) => () =>
  appFetch<Collection>({
    url: `/collections/${id}`,
    withAuth: true,
  });

export const useGetCollectionQuery = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['collection', id],
    queryFn: getCollection(id),
    enabled: !!id,
  });
};

export const useUpdateCollection = (onSuccess: () => Promise<any>) =>
  useMutation<Collection, Error, { id: string; body: BodyInit }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/collections/${id}`,
        config: {
          body: body,
          method: 'PUT',
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess,
  });
