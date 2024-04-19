import BaseService from '@/services/BaseService.ts';
import http from '@/utils/http.ts';
import { LIST_GAMES } from '@/utils/api.ts';

class GameService extends BaseService {
  async listHistory(authToken: string, from: number = 0, perPage: number = 10) {
    const response = await http.get(`${LIST_GAMES}?from=${from}&perPage=${perPage}`, authToken);

    return this.handleResponse(response);
  }
}

export default new GameService();
