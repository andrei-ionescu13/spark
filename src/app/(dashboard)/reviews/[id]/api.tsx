import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getReview } from '../api';

export const useGetReview = () => {
  const { id } = useParams<{ id: string }>();

  return useQuery({
    queryKey: ['product', id],
    queryFn: getReview(id),
  });
};
