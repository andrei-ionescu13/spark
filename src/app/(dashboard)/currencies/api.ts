import { useSearchParamsQuery } from '@/hooks/useSearchParamsQuery';
import { Currency } from '@/types/currencies';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const searchCurrencies =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<{ currencies: Currency[]; count: number }>({
      url: '/currencies/search',
      withAuth: true,
      ...config,
    });

export const useSearchCurrencies = () => {
  const query = useSearchParamsQuery();

  return useQuery({
    queryKey: ['currencies'],
    queryFn: searchCurrencies(query),
  });
};

export const useCreateCurrency = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, string>>({
    mutationFn: (values) =>
      appFetch({
        url: '/currencies',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteCurrency = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/currencies/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });
