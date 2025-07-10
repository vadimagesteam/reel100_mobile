import { useCallback, useState } from 'react';

export const useLoadingCallback = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
): [T, boolean] => {
  const [loading, setLoading] = useState(false);

  const fn = useCallback(
    async (...args: Parameters<T>) => {
      try {
        setLoading(true);
        return await callback(...args);
      } finally {
        setLoading(false);
      }
    },
    [callback],
  ) as T;

  return [fn, loading];
};
