import { useEffect, useRef } from "react";

export const useInitialEffect = (fn: any, deps: any) => {
  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current) {
      return;
    }
    firstRender.current = false;
    fn();
  }, [deps]);
};
