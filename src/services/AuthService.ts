import { SIGNIN_URL, SIGNUP_URL, VERIFY_URL } from '@/utils/api.ts';
import http from '@/utils/http.ts';
import BaseService from '@/services/BaseService.ts';

export interface Credential {
  username: string;
  password: string;
}

class AuthService extends BaseService {
  async signIn(credential: Credential) {
    const response = await http.post(SIGNIN_URL, JSON.stringify(credential));

    return this.handleResponse(response);
  }

  async signUp(registerCredential: Credential) {
    const response = await http.post(SIGNUP_URL, JSON.stringify(registerCredential));

    return this.handleResponse(response);
  }

  async verifyToken(authToken: string) {
    const response = await http.post(VERIFY_URL, JSON.stringify({ token: authToken }));

    return this.handleResponse(response);
  }
}

export default new AuthService();
