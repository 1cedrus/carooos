import BaseService from '@/services/BaseService.ts';
import { ChatMessage } from '@/types.ts';
import http from '@/utils/http.ts';
import { CONVERSATION_URL } from '@/utils/api.ts';

class ConversationService extends BaseService {
  async sendMessage(conversationId: number, msg: ChatMessage, authToken: string) {
    const response = await http.post(`${CONVERSATION_URL}/${conversationId}`, JSON.stringify(msg), authToken);

    return this.isAccepted(response);
  }

  async listConversationMessages(
    from: number,
    perPage: number,
    nonce: number,
    authToken: string,
    conversationId: number,
  ) {
    const response = await http.get(
      `${CONVERSATION_URL}/${conversationId}?from=${from}&perPage=${perPage}&nonce=${nonce}`,
      authToken,
    );

    return this.handleResponse(response);
  }

  async listConversations(authToken: string) {
    const response = await http.get(CONVERSATION_URL, authToken);

    return this.handleResponse(response);
  }
}

export default new ConversationService();
