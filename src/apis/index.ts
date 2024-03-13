export interface ApiEndPoint {
  http: string;
  ws: string;
}

export const apiEndpoint: ApiEndPoint = {
  http: 'http://localhost:9000',
  ws: 'ws://localhost:9000/ws',
};
