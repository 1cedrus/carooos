export interface httpCall {
  get: (url: string, authToken?: string) => Promise<Response>;
  post: (url: string, body?: BodyInit, authToken?: string, contentType?: boolean) => Promise<Response>;
  delete: (url: string, authToken?: string) => Promise<Response>;
}

const http: httpCall = {
  get: (url: string, authToken?: string) => {
    let headers;
    if (authToken) {
      headers = {
        Authorization: 'Bearer ' + authToken,
      };
    }

    return fetch(url, {
      headers,
    });
  },
  post: (url: string, body?: BodyInit, authToken?: string, contentType = true) => {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + authToken,
    };

    if (!contentType) {
      // @ts-ignore
      delete headers['Content-Type'];
    }

    if (!authToken) {
      // @ts-ignore
      delete headers.Authorization;
    }

    return fetch(url, {
      method: 'post',
      headers,
      body,
    });
  },

  delete: (url: string, authToken?: string) => {
    let headers;
    if (authToken) {
      headers = {
        Authorization: 'Bearer ' + authToken,
      };
    }

    return fetch(url, {
      method: 'delete',
      headers,
    });
  },
};

export default http;
