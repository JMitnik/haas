export const useFormatter = () => {

  return {
    booleanToRadio: (value: boolean) => {
      return value ? 'true' : 'false';
    },
    radioToBoolean: (value?: string) => {
      if (value && value === 'true' || value == '1') {
        return true;
      }

      return false;
    },
  }
};
