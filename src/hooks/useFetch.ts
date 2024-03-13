import { useAuthenticationContext } from '@/providers/AuthenticationProvider.tsx';

export default function useFetch() {
  const { jsonWebToken } = useAuthenticationContext();

  if (!jsonWebToken) {
    return fetch;
  }

  return (url: URL | RequestInfo, config?: RequestInit) =>
    fetch(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${jsonWebToken}`,
      },
    });
}
