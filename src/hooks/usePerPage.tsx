import { useEffect, useState } from "react";
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/router';

const isString = (value: any): value is string => typeof value === 'string';

export const useLimit = (): [number, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const { pathname, query, push } = useRouter();
  const [limit, setPerPage] = useState<number>(isString(query.limit) ? Number.parseInt(query.limit) : 10);

  const handlePerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newQuery = { ...query, limit: event.target.value.toString() };

    push({
      pathname: pathname,
      query: newQuery
    });
  };

  useEffect(() => {
    setPerPage(isString(query.limit) ? Number.parseInt(query.limit) : 10);
  }, [query]);

  return [limit, handlePerPageChange];
}