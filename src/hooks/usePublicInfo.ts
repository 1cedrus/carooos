import { useState } from 'react';
import { PublicInformation } from '@/types.ts';
import { useAsync } from 'react-use';
import UserService from '@/services/UserService.ts';
import { IMAGE_URL } from '@/utils/api.ts';
import { toast } from 'react-toastify';

export default function usePublicInfo(username: string): PublicInformation {
  const [elo, setElo] = useState<number>(0);
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');

  useAsync(async () => {
    try {
      const { elo, profilePicUrl } = await UserService.getPublicInfo(username);

      setElo(elo);
      setProfilePicUrl(`${IMAGE_URL}/${profilePicUrl}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, [username]);

  return { username, elo, profilePicUrl };
}
