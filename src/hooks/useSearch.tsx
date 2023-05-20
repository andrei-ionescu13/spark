import { useState, useEffect } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';

const isString = (value: any): value is string => typeof value === 'string';

export const useSearch = (): [string, string, (event: ChangeEvent<HTMLInputElement>) => void, (event: SyntheticEvent, extraQuery?: object) => void] => {
  const { pathname, query, push } = useRouter();
  const [keyword, setKeyword] = useState<string>(isString(query.keyword) ? query.keyword : '');
  const [keywordParam, setKeywordParam] = useState<string>(isString(query.keyword) ? query.keyword : '');

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setKeyword(event.target.value);
  }

  const handleSearch = (event: SyntheticEvent, extraQuery: object = {}): void => {
    event.preventDefault();
    const newQuery = { ...query, ...extraQuery };

    if (!!keyword) {
      newQuery.keyword = keyword;
    } else {
      delete newQuery.keyword;
    }

    delete newQuery.page;

    push({
      pathname: pathname,
      query: newQuery
    });
  }

  useEffect(() => {
    const { keyword } = query;

    if (isString(keyword)) {
      setKeyword(keyword);
      setKeywordParam(keyword);
      return;
    }

    setKeyword('');
    setKeywordParam('');
  }, [query.keyword]);

  return [keyword, keywordParam, handleKeywordChange, handleSearch];
}