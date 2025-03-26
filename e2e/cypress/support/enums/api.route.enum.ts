export interface ApiRouteDetails {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  requestRoute?: string;
}



export class ApiRoute {
  static readonly GetFlowers: ApiRouteDetails = { method: 'GET', route: `http://localhost:5174/mockServiceWorker.js` };
}
