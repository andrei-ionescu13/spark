'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const isString = (value: any): value is string => typeof value === 'string';

export const useQueryValue = (
  key: string,
  defaultValue = '',
  hiddenValue: any = undefined
) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const [value, setValue] = useState<any>(
    isString(searchParams.get(key)) ? searchParams.get(key) : defaultValue
  );

  const handleValueChange = (newValue: string): void => {
    setValue(newValue);
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newValue !== hiddenValue) {
      newSearchParams.set(key, newValue);
    }

    newValue === hiddenValue && newSearchParams.delete(key);
    newSearchParams.delete('page');

    push(`${pathname}?${newSearchParams.toString()}`);
  };

  return [value, handleValueChange];
};

export const useQueryMultipleValues = (key: string) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const [value, setValue] = useState<any>(searchParams.getAll(key));

  const handleValueChange = (newValue: string[]): void => {
    setValue(newValue);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('page');

    push(`${pathname}?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    setValue(searchParams.getAll(key));
  }, [searchParams]);

  return [value, handleValueChange];
};
