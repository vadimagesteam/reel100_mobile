import { useCallback, useState } from 'react';

export const useLoadingCallback = <T extends Function>(callback: T): [T, boolean] => {
  const [loading, setLoading] = useState(false);

  const fn = useCallback(async () => {
    try {
      setLoading(true);
      return await callback();
    } finally {
      setLoading(false);
    }
  }, [callback]);

  return [fn, loading];
};
