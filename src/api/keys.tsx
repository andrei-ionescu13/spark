import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useDeleteKey = (onSuccess: () => Promise<any>) => useMutation((id: string) => appFetch({
  url: `/keys/${id}`,
  config: { method: 'DELETE' },
  withAuth: true
}), { onSuccess });


export const useDeleteKeys = (onSuccess: () => Promise<any>) => useMutation((keyIds: string[]) => appFetch({
  url: `/keys`,
  config: {
    body: JSON.stringify({ ids: keyIds }),
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess })

export const useImportKeys = () => useMutation((values: any) => appFetch({
  url: `/keys/import`,
  noContentType: true,
  withAuth: true,
  config: {
    body: values,
    method: 'POST'
  }
}))

export const useExportKeys = () => useMutation(() => appFetch({ url: `/keys/export` }));

export const useUpdateKeyStatus = (id: string) => useMutation<{}, Error, 'revealed' | 'reported'>((status) => appFetch({
  url: `/keys/${id}/status`,
  config: {
    body: JSON.stringify({ status }),
    method: 'PUT'
  },
  withAuth: true
}))

export const useCreateKey = (onSuccess: () => Promise<any>) => useMutation<{}, Error, Record<string, string>>((values) => appFetch({
  url: '/keys',
  config: {
    body: JSON.stringify(values),
    method: 'POST'
  },
  withAuth: true
}), { onSuccess });