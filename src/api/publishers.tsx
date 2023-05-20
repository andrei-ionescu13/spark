import { appFetch } from "@/utils/app-fetch";
import { useMutation, useQuery } from "react-query";
import type { Publisher } from "@/types/publishers";

export const useListPublishers = () => useQuery('publishers', () => appFetch<Publisher[]>({ url: '/publishers', withAuth: true }));

export const useCreatePublisher = (onSuccess: () => Promise<any>) => useMutation((values: any) => appFetch({
  url: '/publishers',
  config: {
    body: values,
    method: 'POST',
  },
  withAuth: true,
  noContentType: true
}), { onSuccess });

export const useDeletePublisher = () => useMutation((publisherId: string) => appFetch({
  url: `/publishers/${publisherId}`,
  config: { method: 'DELETE' },
  withAuth: true
}))

export const useDeletePublishers = (onSuccess: () => Promise<any>) => useMutation((publisherIds: string[]) => appFetch({
  url: '/publishers',
  config: {
    body: JSON.stringify({ ids: publisherIds }),
    method: 'DELETE'
  },
  withAuth: true
}), { onSuccess });

export const useUpdatePublisher = (onSuccess: () => Promise<any>) => useMutation<{}, Error, { id: string, body: BodyInit }>(({ id, body }) => appFetch({
  url: `/publishers/${id}`,
  config: {
    body: body,
    method: 'PUT',
  },
  noContentType: true,
  withAuth: true
}), { onSuccess });


