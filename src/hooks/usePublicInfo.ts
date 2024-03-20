import { useState } from 'react';
import { PublicInformation } from '@/types.ts';
import useAsync from '@/hooks/useAsync.ts';
import UserService from '@/services/UserService.ts';

export default function usePublicInfo(username: string): PublicInformation {
  const [elo, setElo] = useState<number>(0);

  useAsync(async () => {
    try {
      setElo((await UserService.getPublicInfo(username)).elo);
    } catch (_) {}
  }, [username]);

  return { username, elo };
}
