import BaseService from '@/services/BaseService.ts';
import http from '@/utils/http.ts';
import { CURRENT_GAME_URL } from '@/utils/api.ts';

class GameService extends BaseService {
  async currentGame(authToken: string) {
    const response = await http.get(CURRENT_GAME_URL, authToken);

    return this.handleResponse(response);
  }
}

export default new GameService();
