import { appFetch } from "../app/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateCurrency = (onSuccess: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>({
  mutationFn: (values) => appFetch({
    url: '/currencies',
    config: {
      body: JSON.stringify(values),
      method: 'POST'
    },
    withAuth: true
  }),
  onSuccess
})

export const useDeleteCurrency = (onSuccess: () => Promise<any>) => useMutation<{}, Error, string>({
  mutationFn: (id) => appFetch({
    url: `/currencies/${id}`,
    config: { method: 'DELETE' },
    withAuth: true
  }),
  onSuccess
})