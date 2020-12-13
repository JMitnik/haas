type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

type AtLeastId = AtLeastOne<{id?: string | number | undefined | null}>;

/**
 * Returns the entries from `comparedItems` that do not exist in `existingItems`
 * - Both are lists containing some ID at the very least
 */
export const findDifference = (existingItems?: AtLeastId[] | null, comparedItems?: AtLeastId[] | null): AtLeastId[] => {
  const missingItems = existingItems?.filter((item) => {
    const hasItemInExistingItem = comparedItems?.find((existingItem) => existingItem?.id === item?.id);

    return !hasItemInExistingItem;
  }) || [];

  return missingItems;
};
