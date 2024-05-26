import {
  CHANGE_PASSWORD_URL,
  COMPLETE_RESET_PASSWORD_URL,
  RESET_PASSWORD_URL,
  SIGNIN_URL,
  SIGNUP_URL,
  VERIFY_EMAIL_URL,
  VERIFY_URL,
} from '@/utils/api.ts';
import http from '@/utils/http.ts';
import BaseService from '@/services/BaseService.ts';
import { ResetPasswordInfo } from '@/types.ts';

export interface RegisterCredential {
  email: string;
  username: string;
  password: string;
}

export interface Credential {
  usernameOrEmail: string;
  password: string;
}

export interface ChangePasswordInfo {
  oldPassword: string;
  newPassword: string;
}

class AuthService extends BaseService {
  async signIn(credential: Credential) {
    const response = await http.post(SIGNIN_URL, JSON.stringify(credential));

    return this.handleResponse(response);
  }

  async signUp(registerCredential: RegisterCredential) {
    const response = await http.post(SIGNUP_URL, JSON.stringify(registerCredential));

    return this.handleResponse(response);
  }

  async verifyToken(authToken: string) {
    const response = await http.post(VERIFY_URL, JSON.stringify({ token: authToken }));

    return this.handleResponse(response);
  }

  async changePassword(info: ChangePasswordInfo, authToken: string) {
    const response = await http.post(CHANGE_PASSWORD_URL, JSON.stringify(info), authToken);

    return this.isAccepted(response);
  }

  async getToken(info: ResetPasswordInfo) {
    const response = await http.post(RESET_PASSWORD_URL, JSON.stringify(info));

    return this.isAccepted(response);
  }

  async verifyEmail(info: ResetPasswordInfo) {
    const response = await http.post(VERIFY_EMAIL_URL, JSON.stringify(info));

    return this.isAccepted(response);
  }

  async resetPassword(info: ResetPasswordInfo) {
    const response = await http.post(COMPLETE_RESET_PASSWORD_URL, JSON.stringify(info));

    return this.isAccepted(response);
  }
}

export default new AuthService();
