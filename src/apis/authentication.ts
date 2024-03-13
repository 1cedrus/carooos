import { apiEndpoint } from '@/apis/index.ts';

const LOGIN_URL = `${apiEndpoint.http}/api/auth/authenticate`;
const REGISTER_URL = `${apiEndpoint.http}/api/auth/register`;

interface AuthenticationApis {
  register: (username: string, password: string) => Promise<string>;
  login: (username: string, password: string) => Promise<string>;
}

export const authentication: AuthenticationApis = {
  register: async (username, password) => {
    const response = await fetch(REGISTER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      return token;
    } else {
      throw new Error();
    }
  },

  login: async (username, password) => {
    const response = await fetch(LOGIN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      return token;
    } else {
      throw new Error();
    }
  },
};
