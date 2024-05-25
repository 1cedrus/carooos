import { ErrorDetail } from '@/types.ts';

export default class BaseService {
  async handleError(errorResponse: Response) {
    const { detail } = (await errorResponse.json()) as ErrorDetail;

    throw new Error(detail);
  }

  async handleResponse(response: Response) {
    if (response.ok || response.status === 202) {
      return response.json();
    }

    return this.handleError(response);
  }

  isOk(response: Response) {
    return response.ok;
  }

  isAccepted(response: Response) {
    if (response.status !== 202) {
      return this.handleError(response);
    }

    return true;
  }
}
