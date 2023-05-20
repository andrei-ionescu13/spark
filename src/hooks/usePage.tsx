import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

const isString = (value: any): value is string => typeof value === 'string';

export const usePage = (): [number, (event: unknown, newPage: number) => void] => {
  const { pathname, query, push } = useRouter();
  const [page, setPage] = useState<number>(() => {
    const parsedPage = isString(query.page) ? Number.parseInt(query.page) : 0;

    if (parsedPage > 1) {
      return parsedPage - 1;
    }

    return 0;
  });

  const handlePageChange = (event: unknown, newPage: number): void => {
    const newQuery = { ...query };

    if (newPage === 0) {
      delete newQuery.page;
    } else {
      newQuery.page = (newPage + 1).toString();
    }

    push({
      pathname: pathname,
      query: newQuery
    });
  }

  useEffect(() => {
    const page = isString(query.page) ? Number.parseInt(query.page) : 0;

    if (page > 1) {
      setPage(page - 1);
      return;
    }

    setPage(0);
  }, [query]);

  return [page, handlePageChange]
}