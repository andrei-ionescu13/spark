const isDate = (value: any): value is Date => typeof value?.getMonth === 'function';

export const getStatusFromInterval = (startDate: Date | string, endDate?: Date | string | null): 'expired' | 'active' | 'scheduled' => {
  const now = Date.now();
  startDate = isDate(startDate) ? startDate : new Date(startDate)
  endDate = isDate(endDate) ? endDate : (!!endDate ? new Date(endDate) : null);


  if (endDate && endDate.getTime() <= now) {
    return 'expired'
  }

  if (startDate.getTime() <= now) {
    return 'active'
  }

  return 'scheduled'
}