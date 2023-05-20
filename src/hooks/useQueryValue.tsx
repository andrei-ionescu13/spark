import { useState } from "react";
import { useRouter } from 'next/router';

const isString = (value: any): value is string => typeof value === 'string';

export const useQueryValue = (key: string, defaultValue = '', hiddenValue: any = undefined) => {
  const { pathname, query, push } = useRouter();
  const [value, setValue] = useState<any>(isString(query[key]) ? query[key] : defaultValue);

  const handleValueChange = (newValue: any): void => {
    setValue(newValue)
    const newQuery = {
      ...query,
      ...newValue !== hiddenValue && ({ [key]: newValue })
    };

    newValue === hiddenValue && delete newQuery?.[key]
    delete newQuery?.page;

    push({
      pathname: pathname,
      query: newQuery
    });
  };

  return [value, handleValueChange];
}