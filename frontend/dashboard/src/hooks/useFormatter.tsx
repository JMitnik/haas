export const useFormatter = () => ({
  booleanToRadio: (value: boolean) => (value ? 'true' : 'false'),
  radioToBoolean: (value?: string) => {
    if ((value && (value === 'true' || value === '1'))) {
      return true;
    }

    return false;
  },
});
