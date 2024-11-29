import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Key } from '@/types/keys';
import { appFetch } from '@/utils/app-fetch';
import { download } from '@/utils/download';
import { useQuery } from '@tanstack/react-query';

interface SearchKeysData {
  keys: Key[];
  count: number;
}

export const searchKeys = (query: Record<string, any>) => () =>
  appFetch<SearchKeysData>({
    url: '/keys',
    query,
    withAuth: true,
  });

export const useSearchKeysQuery = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['keys', query],
    queryFn: searchKeys(query),
  });
};

export const exportKeys = async () => {
  const blob = await appFetch({
    url: '/keys/export',
    responseType: 'blob',
    withAuth: true,
  });
  download(blob, 'keys.json');
};
