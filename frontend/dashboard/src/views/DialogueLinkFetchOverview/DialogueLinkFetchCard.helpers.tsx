/**
 * Gets last two slashes from url
 * @param url
 */
export const stripPrefixFromUrl = (url: string): string => {
  const urlParts = url.split('/');
  const lastTwoSlashes = urlParts.slice(-2);

  return lastTwoSlashes.join('/');
};
