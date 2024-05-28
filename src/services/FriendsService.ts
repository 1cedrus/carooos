import http from '@/utils/http.ts';
import { FRIEND_URL } from '@/utils/api.ts';
import BaseService from '@/services/BaseService.ts';

class FriendsService extends BaseService {
  async send(username: string, authToken: string) {
    const response = await http.post(`${FRIEND_URL}/${username}`, '', authToken);

    return this.isAccepted(response);
  }

  async refuse(username: string, authToken: string) {
    const response = await http.delete(`${FRIEND_URL}/${username}`, authToken);

    return this.isAccepted(response);
  }

  async list(authToken: string) {
    const response = await http.get(`${FRIEND_URL}`, authToken);

    return this.handleResponse(response);
  }
}

export default new FriendsService();
