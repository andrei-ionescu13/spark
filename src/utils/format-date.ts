import { format } from 'date-fns';

const isString = (val: any): val is string => typeof val === 'string';

export const formatDate = (date: string | Date): string => {
  if (isString(date)) {
    date = new Date(date);
  }

  return format(date, 'dd.MM.yyyy')
}