import { appFetch } from "@/utils/app-fetch";
import { useMutation, useQuery } from "react-query";
import type { Platform } from "@/types/platforms";

export const useListPlatforms = () => useQuery('platforms', () => appFetch<Platform[]>({ url: '/platforms', withAuth: true }));

export const useCreatePlatform = (onSuccess: () => Promise<any>) => useMutation((values: any) => appFetch({
  url: '/platforms',
  config: {
    body: values,
    method: 'POST',
  },
  withAuth: true,
  noContentType: true
}), { onSuccess })

export const useDeletePlatform = (onSuccess: () => Promise<any>) => useMutation((platformId: string) => appFetch({
  url: `/platforms/${platformId}`,
  config: { method: 'DELETE' },
  withAuth: true
}), { onSuccess })

export const useDeletePlatforms = (onSuccess: () => Promise<any>) => useMutation((platformIds: string[]) => appFetch({
  url: '/platforms',
  config: {
    body: JSON.stringify({ ids: platformIds }),
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess })

export const useUpdatePlatform = (onSuccess: () => Promise<any>) => useMutation<{}, Error, { id: String, body: BodyInit }>(({ id, body }) => appFetch({
  url: `/platforms/${id}`,
  config: {
    body: body,
    method: 'PUT',
  },
  noContentType: true,
  withAuth: true
}), { onSuccess })



