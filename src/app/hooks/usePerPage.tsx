import { useEffect, useState } from "react";
import type { ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const isString = (value: any): value is string => typeof value === 'string';

export const useLimit = (): [number, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const { push } = useRouter();

  let query: any = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  } const [limit, setPerPage] = useState<number>(isString(query.limit) ? Number.parseInt(query.limit) : 10);

  const handlePerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newQuery = { ...query, limit: event.target.value.toString() };

    push(`${[pathname]}?${query.toString()}`);
  };

  useEffect(() => {
    setPerPage(isString(query.limit) ? Number.parseInt(query.limit) : 10);
  }, [query]);

  return [limit, handlePerPageChange];
}