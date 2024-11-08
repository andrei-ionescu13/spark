import { Developer } from '@/types/developer';
import { Feature } from '@/types/feature';
import { Genre } from '@/types/genres';
import { OperatingSystem } from '@/types/operating-sistem';
import { Platform } from '@/types/platforms';
import { Publisher } from '@/types/publishers';
import { Language } from '@/types/translations';
import { appFetch } from '@/utils/app-fetch';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateKey = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, Record<string, string>>({
    mutationFn: (values) =>
      appFetch({
        url: '/keys',
        config: {
          body: JSON.stringify(values),
          method: 'POST',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useImportKeys = () =>
  useMutation({
    mutationFn: (values: any) =>
      appFetch({
        url: `/keys/import`,
        noContentType: true,
        withAuth: true,
        config: {
          body: values,
          method: 'POST',
        },
      }),
  });

export const useUpdateKeyStatus = (id: string) =>
  useMutation<{}, Error, 'revealed' | 'reported'>({
    mutationFn: (status) =>
      appFetch({
        url: `/keys/${id}/status`,
        config: {
          body: JSON.stringify({ status }),
          method: 'PUT',
        },
        withAuth: true,
      }),
  });

export const useDeleteKey = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (id: string) =>
      appFetch({
        url: `/keys/${id}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });

export const useDeleteKeys = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (keyIds: string[]) =>
      appFetch({
        url: `/keys`,
        config: {
          body: JSON.stringify({ ids: keyIds }),
          method: 'DELETE',
        },
        withAuth: true,
      }),
    onSuccess,
  });

export const useExportKeys = () =>
  useMutation({ mutationFn: () => appFetch({ url: `/keys/export` }) });

export const useListPlatforms = () =>
  useQuery({
    queryKey: ['platforms'],
    queryFn: () => appFetch<Platform[]>({ url: '/platforms', withAuth: true }),
  });

const listGenres = () => appFetch<Genre[]>({ url: '/genres', withAuth: true });

const listPublishers = () =>
  appFetch<Publisher[]>({ url: '/publishers', withAuth: true });

const listPlatforms = () =>
  appFetch<Platform[]>({ url: '/platforms', withAuth: true });

const listDevelopers = () =>
  appFetch<Developer[]>({ url: '/developers', withAuth: true });

const listFeatures = () =>
  appFetch<Feature[]>({ url: '/features', withAuth: true });

const listLanguages = () =>
  appFetch<Language[]>({ url: '/languages', withAuth: true });

const listOperatingSystems = () =>
  appFetch<OperatingSystem[]>({
    url: '/operating-systems',
    withAuth: true,
  });

export const useListDevelopersQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['developers'],
    queryFn: listDevelopers,
    ...options,
  });

export const useListFeaturesQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['features'],
    queryFn: listFeatures,
    ...options,
  });

export const useListGenresQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['genres'],
    queryFn: listGenres,
    ...options,
  });

export const useListLanguagesQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['languages'],
    queryFn: listLanguages,
    ...options,
  });

export const useListOperatingSystemsQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['operating-systems'],
    queryFn: listOperatingSystems,
    ...options,
  });

export const useListPlatformsQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['platforms'],
    queryFn: listPlatforms,
    ...options,
  });

export const useListPublishersQuery = (options = { enabled: true }) =>
  useQuery({
    queryKey: ['publishers'],
    queryFn: listPublishers,
    ...options,
  });

export const useDeleteProduct = (onSuccess?: () => Promise<any>) =>
  useMutation({
    mutationFn: (productsId: string) =>
      appFetch({
        url: `/products/${productsId}`,
        config: { method: 'DELETE' },
        withAuth: true,
      }),
    onSuccess,
  });
