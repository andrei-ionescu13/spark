import { appFetch } from '@/utils/app-fetch';
import { download } from '@/utils/download';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Key } from 'readline';

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
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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
