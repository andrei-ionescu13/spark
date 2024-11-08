import { Order } from '@/types/orders';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

interface SearchOrdersData {
  orders: Order[];
  count: number;
}

export const searchOrders = (query: ParsedUrlQuery) => () =>
  appFetch<SearchOrdersData>({
    url: '/orders/search',
    query,
    withAuth: true,
  });

export const useSearchOrders = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['orders', query],
    queryFn: searchOrders(query),
  });
};