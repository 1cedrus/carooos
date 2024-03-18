import { useState } from 'react';
import { PublicInformation } from '@/types.ts';
import useAsync from '@/hooks/useAsync.ts';
import UserService from '@/services/UserService.ts';
import { EventName, triggerEvent } from '@/utils/eventemitter.ts';

export default function usePublicInfo(username: string): PublicInformation {
  const [elo, setElo] = useState<number>(0);

  useAsync(async () => {
    try {
      setElo((await UserService.getPublicInfo(username)).elo);
    } catch (_) {
      triggerEvent(EventName.OpenInforSnackBar, 'Some error occurred!');
    }
  }, [username]);

  return { username, elo };
}
