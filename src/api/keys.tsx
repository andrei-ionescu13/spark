import { appFetch } from "../app/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useDeleteKey = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (id: string) => appFetch({
    url: `/keys/${id}`,
    config: { method: 'DELETE' },
    withAuth: true
  }),
  onSuccess
});


export const useDeleteKeys = (onSuccess: () => Promise<any>) => useMutation({
  mutationFn: (keyIds: string[]) => appFetch({
    url: `/keys`,
    config: {
      body: JSON.stringify({ ids: keyIds }),
      method: 'DELETE'
    },
    withAuth: true
  }),
  onSuccess
})

export const useImportKeys = () => useMutation({
  mutationFn: (values: any) => appFetch({
    url: `/keys/import`,
    noContentType: true,
    withAuth: true,
    config: {
      body: values,
      method: 'POST'
    }
  })
})

export const useExportKeys = () => useMutation({ mutationFn: () => appFetch({ url: `/keys/export` }) });

export const useUpdateKeyStatus = (id: string) => useMutation<{}, Error, 'revealed' | 'reported'>({
  mutationFn: (status) => appFetch({
    url: `/keys/${id}/status`,
    config: {
      body: JSON.stringify({ status }),
      method: 'PUT'
    },
    withAuth: true
  })
})

export const useCreateKey = (onSuccess: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>({
  mutationFn: (values) => appFetch({
    url: '/keys',
    config: {
      body: JSON.stringify(values),
      method: 'POST'
    },
    withAuth: true
  }),
  onSuccess
});