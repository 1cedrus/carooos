import http from '@/utils/http.ts';
import { PUBLIC_USER_INFORMATION_URL, PUBLIC_USERS_INFORMATION_URL, USER_INFORMATION_URL } from '@/utils/api.ts';
import BaseService from '@/services/BaseService.ts';

class UserService extends BaseService {
  async getUserInfo(authToken: string) {
    const response = await http.get(USER_INFORMATION_URL, authToken);

    if (response.ok) {
      return response.json();
    }

    return this.handleError(response);
  }

  async getPublicInfo(username: string) {
    const response = await http.get(`${PUBLIC_USER_INFORMATION_URL}?username=${username}`);

    return this.handleResponse(response);
  }

  async getPublicInfos(queryUsername: string) {
    const response = await http.get(`${PUBLIC_USERS_INFORMATION_URL}?query=${queryUsername}`);

    return this.handleResponse(response);
  }
}

export default new UserService();
