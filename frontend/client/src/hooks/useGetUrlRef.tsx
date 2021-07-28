import { useLocation } from 'react-router-dom';
import qs from 'qs';

export const useGetUrlRef = () => {
  const location = useLocation();
  const ref = qs.parse(location.search, { ignoreQueryPrefix: true })?.ref?.toString() || '';

  return ref;
};
