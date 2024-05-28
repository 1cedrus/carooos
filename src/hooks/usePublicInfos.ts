import { PublicInformation } from '@/types.ts';
import { useState } from 'react';
import { useAsync } from 'react-use';
import UserService from '@/services/UserService.ts';

export default function usePublicInfos(query: string): PublicInformation[] {
  const [result, setResult] = useState<PublicInformation[]>([]);

  useAsync(async () => {
    try {
      setResult(await UserService.getPublicInfos(query));
    } catch (_) {}
  }, [query]);

  return result;
}
