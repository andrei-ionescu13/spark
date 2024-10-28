'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useEffect, useState } from 'react';

const isString = (value: any): value is string => typeof value === 'string';

export const useSearch = (): [
  string,
  (event: ChangeEvent<HTMLInputElement>) => void,
  (event: SyntheticEvent, extraQuery?: object) => void,
] => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const keywordSearchParam = searchParams.get('keyword');
  const { push } = useRouter();
  const [keyword, setKeyword] = useState<string>(
    isString(keywordSearchParam) ? keywordSearchParam : ''
  );

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value);
  };

  const handleSearch = (event: SyntheticEvent): void => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!!keyword) {
      newSearchParams.set('keyword', keyword);
    } else {
      newSearchParams.delete('keyword');
    }

    newSearchParams.delete('page');

    push(`${[pathname]}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (isString(keywordSearchParam)) {
      setKeyword(keywordSearchParam);
      return;
    }

    setKeyword('');
  }, [keywordSearchParam]);

  return [keyword, handleKeywordChange, handleSearch];
};
