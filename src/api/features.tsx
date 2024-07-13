import { Feature } from "@/types/feature";
import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateFeature = (onSuccess: any) =>
  useMutation<{ name: string }, Error, Record<string, unknown>>({
    mutationFn: (values) =>
      appFetch({
        url: "/features",
        config: {
          body: JSON.stringify(values),
          method: "POST",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useDeleteFeature = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string>({
    mutationFn: (featureId) =>
      appFetch({
        url: `/features/${featureId}`,
        config: {
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );

export const useUpdateFeature = (id: string, onSuccess: () => Promise<any>) =>
  useMutation<{ name: string }, Error, { name: string; slug: string }>({
    mutationFn: (value) =>
      appFetch({
        withAuth: true,
        url: `/features/${id}`,
        config: {
          body: JSON.stringify(value),
          method: "PUT",
        },
      }),
    onSuccess
  });

export const listFeatures =
  (config: Record<string, any> = {}) =>
    () =>
      appFetch<Feature[]>({
        url: "/features",
        withAuth: true,
        ...config,
      });

export const useDeleteFeatures = (onSuccess?: () => Promise<any>) =>
  useMutation<{}, Error, string[]>({
    mutationFn: (featureIds) =>
      appFetch({
        url: `/features`,
        config: {
          body: JSON.stringify({ ids: featureIds }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  }
  );
