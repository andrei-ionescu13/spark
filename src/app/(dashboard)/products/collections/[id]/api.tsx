import { Collection } from '@/types/collection';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
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
