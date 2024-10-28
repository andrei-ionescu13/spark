import { Product } from "../app/types/products";
import { appFetch } from "../app/utils/app-fetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateProduct = () =>
  useMutation<{ id: string }, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: "/products",
        noContentType: true,
        config: {
          body: values,
          method: "POST",
        },
        withAuth: true,
      })
  });

export const useDeleteProduct = (onSuccess?: () => Promise<any>) =>
  useMutation({
    mutationFn: (productsId: string) =>
      appFetch({
        url: `/products/${productsId}`,
        config: { method: "DELETE" },
        withAuth: true,
      }),
    onSuccess
  });

export const useDeleteProducts = (onSuccess: () => Promise<any>) =>
  useMutation({
    mutationFn: (productsIds: string[]) =>
      appFetch({
        url: "/products",
        config: {
          body: JSON.stringify({ ids: productsIds }),
          method: "DELETE",
        },
        withAuth: true,
      }),
    onSuccess
  });

export const useUpdateProductStatus = (id: string) =>
  useMutation<string, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/status`,
        config: {
          body: JSON.stringify(values),
          method: "PUT",
        },
        withAuth: true,
      })
  });

export const useUpdateProductMeta = (id: string) =>
  useMutation<Product, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/meta`,
        config: {
          body: JSON.stringify(values),
          method: "PUT",
        },
        withAuth: true,
      })
  });

export const useUpdateProductGeneral = (id: string) =>
  useMutation<Product, Error, Record<string, any>>({
    mutationFn: (values) =>
      appFetch({
        withAuth: true,
        url: `/products/${id}/general`,
        config: {
          body: JSON.stringify(values),
          method: "PUT",
        },
      })
  });

export const useUpdateProductMedia = (id: string) =>
  useMutation<Product, Error, BodyInit>({
    mutationFn: (values) =>
      appFetch({
        url: `/products/${id}/media`,
        config: {
          body: values,
          method: "PUT",
        },
        withAuth: true,
        noContentType: true,
      })
  });

export const useDeleteProductKey = () =>
  useMutation<{}, Error, { productId: string; keyId: string }>({
    mutationFn: ({ productId, keyId }) =>
      appFetch({
        url: `/products/${productId}/keys/${keyId}`,
        config: { method: "DELETE" },
        withAuth: true,
      })
  });

export const useImportProductKeys = (onSuccess: () => Promise<any>) =>
  useMutation<{}, Error, { id: string; formData: FormData }>({
    mutationFn: ({ id, formData }) =>
      appFetch({
        url: `/products/${id}/keys/import`,
        config: {
          body: formData,
          method: "POST",
        },
        withAuth: true,
        noContentType: true,
      }),
    onSuccess
  });
