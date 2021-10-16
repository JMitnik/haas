import { format } from 'date-fns';

export const formatSimpleDate = (dateString?: string) => {
  if (!dateString) {
    return 'N/A';
  }
  return format(new Date(dateString), 'd MMM yyyy, HH:mm');
};
