import type { Translation } from "@/types/translations";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useCreateLanguage = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>((values) => appFetch({
  url: '/languages',
  config: {
    body: JSON.stringify(values),
    method: 'POST'
  },
  withAuth: true
}), { onSuccess })

export const useDeleteLanguage = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, { id: string, shouldDeleteTranslations: boolean }>(({ id, shouldDeleteTranslations }) => appFetch({
  url: `/languages/${id}`,
  config: {
    body: JSON.stringify({ shouldDeleteTranslations }),
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess })

export const useCreateNamespace = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>((values) => appFetch({
  url: '/namespaces',
  config: {
    body: JSON.stringify(values),
    method: 'POST'
  },
  withAuth: true
}), { onSuccess })

export const useDeleteNamespace = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, string>((id) => appFetch({
  url: `/namespaces/${id}`,
  config: { method: 'DELETE' },
  withAuth: true
}), { onSuccess })

export const useAddNamespaceTranslation = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, { id: string, body: Record<string, any> }>(({ id, body }) => appFetch({
  url: `/namespaces/${id}/translation`,
  config: {
    body: JSON.stringify(body),
    method: 'POST'
  },
  withAuth: true
}), { onSuccess })


export const useUpdateNamespaceName = (onSuccess?: () => Promise<any>) => useMutation<{}, Error, { id: string, name: string }>(({ id, name }) => appFetch({
  url: `/namespaces/${id}/name`,
  config: {
    body: JSON.stringify({ name }),
    method: 'PUT'
  },
  withAuth: true
}), { onSuccess })

export const useDeleteNamespaceTranslation = () => useMutation<{}, Error, { id: string, translationKey: string }>(({ id, translationKey }) => appFetch({
  url: `/namespaces/${id}/translations/${translationKey}`,
  config: { method: 'DELETE' },
  withAuth: true
}))

export const useUpdateNamespaceTranslation =
  (onSuccess?: () => Promise<any>) =>
    useMutation<{}, Error, { id: string, translationKey: string, body: Record<string, any> }>(({ id, translationKey, body }) =>
      appFetch({
        url: `/namespaces/${id}/translations/${translationKey}`,
        config: {
          body: JSON.stringify(body),
          method: 'PUT'
        },
        withAuth: true
      }), { onSuccess })

