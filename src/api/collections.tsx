import type { Collection } from "@/types/collection";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateCollection = () => useMutation<any, Error, BodyInit>({
  mutationFn: (values) => appFetch({
    url: '/collections',
    noContentType: true,
    config: {
      body: values,
      method: 'POST'
    },
    withAuth: true
  })
});

export const useDeleteCollection = () => useMutation<Collection, Error, string>({
  mutationFn: (id) => appFetch({
    url: `/collections/${id}`,
    config: { method: 'DELETE' },
    withAuth: true,
  })
})

export const useDeleteCollections = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (ids: string[]) => appFetch({
    url: `/collections`,
    config: {
      body: JSON.stringify({ ids }),
      method: 'DELETE'
    },
    withAuth: true
  }),
  onSuccess
})

export const useDeactivateCollection = () => useMutation<Collection, Error, string>({
  mutationFn: (id) => appFetch({
    url: `/collections/${id}/deactivate`,
    config: { method: 'PUT' },
    withAuth: true,
  })
})

export const useUpdateCollection = (onSuccess: () => Promise<any>) => useMutation<Collection, Error, { id: string, body: BodyInit }>({
  mutationFn: ({ id, body }) => appFetch({
    url: `/collections/${id}`,
    config: {
      body: body,
      method: 'PUT'
    },
    withAuth: true,
    noContentType: true
  }),
  onSuccess
})
