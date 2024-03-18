export default class BaseService {
  async handleError(errorResponse: Response) {
    const { message } = await errorResponse.json();
    throw new Error(message);
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
    return response.status === 202;
  }
}
