import { RequestValues } from '../../data/post_request';

export default class RequestService {
  private urlBase: string;
  static _instance: RequestService;

  private constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  public async postRequest(values: RequestValues, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
    };

    const response = await fetch(`${this.urlBase}/jobs`, requestOptions);
    return response.json();
  }

  public async getRequest() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'Get',
      headers: myHeaders,
    };

    const response = await fetch(`${this.urlBase}/jobs`, requestOptions);
    return response.json();
  }

  public static getInstance(urlBase: string) {
    return this._instance || (this._instance = new this(urlBase));
  }
}
