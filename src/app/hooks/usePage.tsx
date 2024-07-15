import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const isString = (value: any): value is string => typeof value === 'string';

export const usePage = (): [number, (event: unknown, newPage: number) => void] => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const { push } = useRouter();

  let query: any = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }

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

    push(`${[pathname]}?${query.toString()}`);
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