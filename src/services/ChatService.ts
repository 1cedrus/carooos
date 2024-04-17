import BaseService from '@/services/BaseService.ts';
import { ChatMessage } from '@/types.ts';
import http from '@/utils/http.ts';
import { MESSAGES_URL } from '@/utils/api.ts';

class ChatService extends BaseService {
  async sendMessage(msg: ChatMessage, authToken: string) {
    const response = await http.post(MESSAGES_URL, JSON.stringify(msg), authToken);

    return this.isAccepted(response);
  }

  async listConversationMessages(ucid: number, authToken: string) {
    const response = await http.get(`${MESSAGES_URL}/${ucid}`, authToken);

    return this.handleResponse(response);
  }
}

export default new ChatService();
