import { useEffect } from 'react';

const useDebugReference = (reference: any, name: any) => {
  useEffect(() => {
    console.info(`Reference ${name} has updated`);
    console.log(`\tNew value: ${reference}`);
  }, [reference, name]);
};

export default useDebugReference;
