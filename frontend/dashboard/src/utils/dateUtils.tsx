import { format } from 'date-fns';

export const formatSimpleDate = (dateString: string) => format(new Date(dateString), 'd MMM yyyy, HH:mm');
