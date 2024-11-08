import { Review } from '@/types/review';
import { appFetch } from '@/utils/app-fetch';

export const getReview =
  (id: string, config: Record<string, any> = {}) =>
  () =>
    appFetch<Review>({
      url: `/reviews/${id}`,
      withAuth: true,
      ...config,
    });
