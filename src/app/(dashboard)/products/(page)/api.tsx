import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Product } from '@/types/products';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

interface SearchProductsData {
  products: Product[];
  count: number;
}

export const searchProducts = (query: Record<string, any>) => () =>
  appFetch<SearchProductsData>({
    url: '/products',
    query,
    withAuth: true,
  });

export const useSearchProducts = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['products', query],
    queryFn: searchProducts(query),
  });
};

export const useDeleteProducts = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (productsIds: string[]) =>
      appFetch({
        url: '/products',
        config: {
          body: JSON.stringify({ ids: productsIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });
