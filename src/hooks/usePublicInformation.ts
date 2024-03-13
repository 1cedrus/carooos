import useFetch from '@/hooks/useFetch.ts';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api.ts';
import { PublicInformation } from '@/types.ts';

export default function usePublicInformation(username?: string): PublicInformation {
  const fetch = useFetch();
  const [elo, setElo] = useState<number>();

  useEffect(() => {
    if (!username) return;

    (async () => {
      const response = await fetch(`${api.http}/api/public/user?username=${username}`);

      if (response.ok) {
        const { username: _username, elo } = await response.json();
        setElo(elo);
      }
    })();
  }, [username]);

  return { username, elo };
}
