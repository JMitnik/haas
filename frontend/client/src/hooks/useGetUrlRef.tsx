import qs from 'qs';
import { useLocation } from 'react-router-dom';

export const useGetUrlRef = () => {
  const location = useLocation();
  const ref = qs.parse(location.search, { ignoreQueryPrefix: true })?.ref?.toString() || '';

  return ref;
}