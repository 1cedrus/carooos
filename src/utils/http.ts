export interface httpCall {
  get: (url: string, authToken?: string) => Promise<Response>;
  post: (url: string, jsonBody?: string, authToken?: string) => Promise<Response>;
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
  post: (url: string, jsonBody?: string, authToken?: string) => {
    let headers;
    if (authToken) {
      headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
      };
    }

    return fetch(url, {
      method: 'post',
      headers,
      body: jsonBody,
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
