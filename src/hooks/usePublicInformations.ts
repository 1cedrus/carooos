import { PublicInformation } from '@/types.ts';
import useFetch from '@/hooks/useFetch.ts';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api.ts';

export default function usePublicInformations(query: string): PublicInformation[] {
  const fetch = useFetch();
  const [result, setResult] = useState<PublicInformation[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch(`${api.http}/api/public/users?query=${query}`);

      if (response.ok) {
        const result = await response.json();
        setResult(result);
      }
    })();
  }, []);

  return result;
}
