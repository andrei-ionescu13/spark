import { OperatingSystem } from "@/types/operating-sistem";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useCreateOperatingSystem = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>(
    (values) =>
      appFetch({
        url: "/operating-systems",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    { onSuccess }
  );

export const useDeleteOperatingSystem = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>(
    (operatingSystemId) =>
      appFetch({
        url: `/operating-systems/${operatingSystemId}`,
        config: {
          method: "DELETE",
        },
        withAuth: true,
      }),
    { onSuccess }
  );

export const useUpdateOperatingSystem = (
  id: string,
  onSuccess: () => Promise<any>
) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>(
    (value) =>
      appFetch({
        withAuth: true,
        url: `/operating-systems/${id}`,
        config: {
          body: JSON.stringify(value),
          method: "PUT",
        },
      }),
    { onSuccess }
  );

export const listOperatingSystems =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<OperatingSystem[]>({
      url: "/operating-systems",
      withAuth: true,
      ...config,
    });

export const useDeleteOperatingSystems = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>(
    (operatingSystemIds) =>
      appFetch({
        url: `/operating-systems`,
        config: {
          body: JSON.stringify({ ids: operatingSystemIds }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    { onSuccess }
  );
