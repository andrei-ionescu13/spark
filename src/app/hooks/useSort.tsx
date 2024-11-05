'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const isString = (value: any): value is string => typeof value === 'string';

export const useSort = (): [
  string | undefined,
  'asc' | 'desc' | undefined,
  (property: string) => void,
] => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  let query: any = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

  const [sortBy, setSortBy] = useState(
    isString(query?.sort) ? query?.sort?.split('-')[0] : undefined
  );
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | undefined>(
    isString(query?.sort)
      ? (query?.sort?.split('-')[1] as 'asc' | 'desc')
      : undefined
  );

  const handleSort = (property: string): void => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!sortBy || sortBy !== property) {
      newSearchParams.set('sort', `${property}-asc`);
    } else {
      sortOrder === 'asc'
        ? newSearchParams.set('sort', `${property}-desc`)
        : newSearchParams.set('sort', `${property}-asc`);
    }

    push(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    const { sort } = query;

    setSortBy(isString(sort) ? sort?.split('-')[0] : undefined);
    setSortOrder(
      isString(sort) ? (sort?.split('-')[1] as 'asc' | 'desc') : undefined
    );
  }, [query]);

  return [sortBy, sortOrder, handleSort];
};
