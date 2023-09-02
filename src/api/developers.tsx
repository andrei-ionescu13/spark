import { Developer } from "@/types/developer";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useCreateDeveloper = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>(
    (values) =>
      appFetch({
        url: "/developers",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    { onSuccess }
  );

export const useDeleteDeveloper = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>(
    (developerId) =>
      appFetch({
        url: `/developers/${developerId}`,
        config: {
          method: "DELETE",
        },
        withAuth: true,
      }),
    { onSuccess }
  );

export const useUpdateDeveloper = (id: string, onSuccess: () => Promise<any>) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>(
    (value) =>
      appFetch({
        withAuth: true,
        url: `/developers/${id}`,
        config: {
          body: JSON.stringify(value),
          method: "PUT",
        },
      }),
    { onSuccess }
  );

export const listDevelopers =
  (config: Record<string, any> = {}) =>
  () =>
    appFetch<Developer[]>({
      url: "/developers",
      withAuth: true,
      ...config,
    });

export const useDeleteDevelopers = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>(
    (developerIds) =>
      appFetch({
        url: `/developers`,
        config: {
          body: JSON.stringify({ ids: developerIds }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    { onSuccess }
  );
