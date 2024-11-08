import { Order } from '@/types/orders';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

interface SearchUserOrdersData {
  orders: Order[];
  count: number;
}

//change hooks
//use /user/id/orders/search as url
export const searchUserOrders =
  (query: ParsedUrlQuery, config: Record<string, any> = {}) =>
  () =>
    appFetch<SearchUserOrdersData>({
      url: '/orders/search',
      query,
      withAuth: true,
      ...config,
    });

export const useSearchUserOrders = () => {
  const query: any = {};
  const searchParams = useSearchParams();

  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  return useQuery({
    queryKey: ['user-orders', query],
    queryFn: searchUserOrders(query),
  });
};
