'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { listLanguages, searchNamespaces } from './api-calls';

export const useListLanguagesQuery = () =>
  useQuery({
    queryKey: ['namespace-languages'],
    queryFn: listLanguages(),
  });

export const useSearchNamespacesQuery = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['namespaces', query],
    queryFn: searchNamespaces(query),
  });
};
