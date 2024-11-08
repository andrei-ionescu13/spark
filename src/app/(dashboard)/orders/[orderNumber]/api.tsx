import { Order } from '@/types/orders';
import { appFetch } from '@/utils/app-fetch';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const getOrder = (orderNumber: string) => () =>
  appFetch<Order>({
    url: `/orders/${orderNumber}`,
    withAuth: true,
  });

export const useGetOrder = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return useQuery({
    queryKey: ['orders', orderNumber],
    queryFn: getOrder(orderNumber),
  });
};
