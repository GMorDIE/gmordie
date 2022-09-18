import { useEffect, useRef } from "react";

export const useIsMountedRef = () => {
  const refIsMounted = useRef(false);

  useEffect(() => {
    if (refIsMounted.current) return;
    refIsMounted.current = true;
  }, []);

  return refIsMounted;
};
