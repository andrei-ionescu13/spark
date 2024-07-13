import type { Translation } from "@/types/translations";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateTranslationsLanguage = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: "/translations/languages",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useDeleteLanguage = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; shouldDeleteTranslations: boolean }>({
    mutationFn: ({ id, shouldDeleteTranslations }) =>
      appFetch({
        url: `/translations/languages/${id}`,
        config: {
          body: JSON.stringify({ shouldDeleteTranslations }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useCreateNamespace = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, string>>({
    mutationFn: (values) =>
      appFetch({
        url: "/translations/namespaces",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useDeleteNamespace = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (id) =>
      appFetch({
        url: `/translations/namespaces/${id}`,
        config: { method: "DELETE" },
        withAuth: true,
      }),
    onSuccess
  });

export const useAddNamespaceTranslation = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; body: Record<string, any> }>({
    mutationFn: ({ id, body }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translation`,
        config: {
          body: JSON.stringify(body),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useUpdateNamespaceName = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) =>
      appFetch({
        url: `/translations/namespaces/${id}/name`,
        config: {
          body: JSON.stringify({ name }),
          method: "PUT",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useDeleteNamespaceTranslation = () =>
  useMutation<{}, Error, { id: string; translationKey: string }>({
    mutationFn: ({ id, translationKey }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translations/${translationKey}`,
        config: { method: "DELETE" },
        withAuth: true,
      })
  });

export const useUpdateNamespaceTranslation = (onSuccess?: () => Promise<any>) =>
  useMutation<
    {},
    Error,
    { id: string; translationKey: string; body: Record<string, any> }
  >({
    mutationFn: ({ id, translationKey, body }) =>
      appFetch({
        url: `/translations/namespaces/${id}/translations/${translationKey}`,
        config: {
          body: JSON.stringify(body),
          method: "PUT",
        },
        withAuth: true,
      }),
    onSuccess
  });
