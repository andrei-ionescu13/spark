import { useSearchParams } from 'next/navigation';

export const useSearchParamsQuery = () => {
  const searchParams = useSearchParams();
  let query: Record<string, any> = {};

  for (const [key, value] of searchParams.entries()) {
    if (query[key]) {
      query[key] = Array.isArray(query[key])
        ? [...query[key], value]
        : [query[key], value];
    } else {
      query[key] = value;
    }
  }

  return query;
};
