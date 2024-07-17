"use client"

import { useState, useEffect } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const isString = (value: any): value is string => typeof value === 'string';

export const useSearch = (): [string, (event: ChangeEvent<HTMLInputElement>) => void, (event: SyntheticEvent, extraQuery?: object) => void] => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const { push } = useRouter();
  const [keyword, setKeyword] = useState<any>(isString(searchParams.get('keyword')) ? searchParams.get('keyword') : '');
  // const [keywordParam, setKeywordParam] = useState<any>(isString(searchParams.get('keyword')) ? searchParams.get('keyword') : '');

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value);
  }

  const handleSearch = (event: SyntheticEvent, extraQuery: object = {}): void => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (!!keyword) {
      newSearchParams.set('keyword', keyword)
    } else {
      newSearchParams.delete('keyword')
    }

    newSearchParams.delete('page');

    push(`${[pathname]}?${newSearchParams.toString()}`);
  }

  useEffect(() => {
    const keyword = searchParams.get('keyword');

    if (isString(keyword)) {
      setKeyword(keyword);
      // setKeywordParam(keyword);
      return;
    }

    setKeyword('');
    // setKeywordParam('');
  }, [searchParams.get('keyword')]);

  return [keyword, handleKeywordChange, handleSearch];
}