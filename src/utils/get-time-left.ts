import { subDays, subHours, subMinutes } from 'date-fns';

export const getTimeLeft = (timeDiff: number) => {
  const days = Math.floor(timeDiff / 24 / 60 / 60 / 1000);
  timeDiff = subDays(timeDiff, days).valueOf();
  const hours = Math.floor(timeDiff / 60 / 60 / 1000);
  timeDiff = subHours(timeDiff, hours).valueOf();
  const minutes = Math.floor(timeDiff / 60 / 1000);
  timeDiff = subMinutes(timeDiff, minutes).valueOf();
  const seconds = Math.floor(timeDiff / 1000);

  const mappedDiff = [
    {
      label: 'days',
      value: days
    },
    {
      label: 'hours',
      value: hours
    },
    {
      label: 'mins',
      value: minutes
    },
    {
      label: 'secs',
      value: seconds
    }
  ];

  return mappedDiff.filter((item, index) => {
    if (item.value <= 0 && index === 0) return false;

    if (item.value <= 0 && mappedDiff[index - 1].value <= 0) return false;

    return true;
  });
};