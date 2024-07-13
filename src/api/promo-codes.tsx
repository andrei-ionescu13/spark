import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";
import type { PromoCode } from "@/types/promo-code";

export const useCreatePromoCode = () => useMutation<any, Error, Record<string, any>>({
  mutationFn: (values) => appFetch({
    url: '/promo-codes',
    config: {
      body: JSON.stringify(values),
      method: 'POST',
    },
    withAuth: true,
  })
})

export const useDeletePromoCodes = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (ids: string[]) => appFetch({
    url: '/promo-codes',
    config: {
      body: JSON.stringify({ ids: ids }),
      method: 'DELETE'
    },
    withAuth: true
  }),
  onSuccess
})

export const useDeletePromoCode = (onSuccess?: () => Promise<any>) => useMutation<PromoCode, Error, string>({
  mutationFn: (id) => appFetch({
    url: `/promo-codes/${id}`,
    config: { method: 'DELETE' },
    withAuth: true,
  }),
  onSuccess
})

export const useDeactivatePromoCode = (onSuccess: () => Promise<any>) => useMutation<PromoCode, Error, string>({
  mutationFn: (id) => appFetch({
    url: `/promo-codes/${id}/deactivate`,
    config: { method: 'PUT' },
    withAuth: true,
  }),
  onSuccess
})

export const useUpdatePromoCode = (onSuccess: () => Promise<any>) => useMutation<PromoCode, Error, { id: string, body: Record<string, any> }>({
  mutationFn: ({ id, body }) => appFetch({
    url: `/promo-codes/${id}`,
    config: {
      method: 'PUT',
      body: JSON.stringify(body)
    },
    withAuth: true,
  }),
  onSuccess
})
