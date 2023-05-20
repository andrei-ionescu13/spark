import { appFetch } from "@/utils/app-fetch";
import { useMutation } from "react-query";

export const useDeleteReview = () =>
  useMutation((id: string) =>
    appFetch({
      url: `/reviews/${id}`,
      config: { method: "DELETE" },
      withAuth: true,
    })
  );

export const useUpdateReviewStatus = (id: string) =>
  useMutation<{}, Error, Record<string, string>>((value) =>
    appFetch({
      url: `/reviews/${id}/status`,
      config: {
        method: "PUT",
        body: JSON.stringify(value),
      },
      withAuth: true,
    })
  );

export const useDeleteReviews = () =>
  useMutation((reviewIds: string[]) =>
    appFetch({
      url: "/reviews",
      config: {
        body: JSON.stringify({ ids: reviewIds }),
        method: "DELETE",
      },
      withAuth: true,
    })
  );
