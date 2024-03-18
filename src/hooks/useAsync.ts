import { useEffect } from 'react';

export default function useAsync(asyncFunc: () => Promise<void>, deps: unknown[]) {
  useEffect(() => {
    (async () => {
      await asyncFunc();
    })();
  }, deps);
}
