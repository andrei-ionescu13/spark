import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useCreateCurrency = (onSuccess: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>((values) => appFetch({
  url: '/currencies',
  config: {
    body: JSON.stringify(values),
    method: 'POST'
  },
  withAuth: true
}), { onSuccess })

export const useDeleteCurrency = (onSuccess: () => Promise<any>) => useMutation<{}, Error, string>((id) => appFetch({
  url: `/currencies/${id}`,
  config: { method: 'DELETE' },
  withAuth: true
}), { onSuccess })