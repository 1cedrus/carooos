import BaseService from '@/services/BaseService.ts';
import { ChatMessage } from '@/types.ts';
import http from '@/utils/http.ts';
import { MESSAGES_URL } from '@/utils/api.ts';

class ChatService extends BaseService {
  async sendMessage(msg: ChatMessage, authToken: string) {
    const response = await http.post(MESSAGES_URL, JSON.stringify(msg), authToken);

    return this.isAccepted(response);
  }

  async listConversationMessages(ucid: number, authToken: string, from: number = 0, perPage: number = 10) {
    const response = await http.get(`${MESSAGES_URL}/${ucid}?from=${from}&perPage=${perPage}`, authToken);

    return this.handleResponse(response);
  }
}

export default new ChatService();
