import { SetterOrUpdater } from 'recoil';

interface SignResponse {
  status: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  userId?: number;
} // Raw values from response of sign in API
interface SignResult {
  status: number;
  accessToken?: string;
  refreshToken?: string;
  expiredTime?: string;
  userId?: string;
  message?: string;
} // Sanitized values from response of sign in API

export default class AuthService {
  private date!: Date;
  private setToken!: SetterOrUpdater<string>;
  private setIsAuthorized!: SetterOrUpdater<string>;
  private window!: Window;
  private urlBase: string;

  private accessToken?: string;
  private refreshToken?: string;
  private expiredTime?: string;
  private userId?: string;
  private stored?: 'localStorage' | 'sessionStorage';

  constructor() {
    this.urlBase = 'http://localhost:8080';
  }

  async init(
    setToken: SetterOrUpdater<string>,
    setIsAuthorized: SetterOrUpdater<string>,
    window: Window,
    date: Date
  ) {
    this.setToken = setToken;
    this.setIsAuthorized = setIsAuthorized;
    this.window = window;
    this.date = date;
    this.setMembersFromStorage();

    if (this.expiredTime) {
      const isAuthorized = !this.isAccessTokenExpired(this.expiredTime); // if it is expired, it is not authorized.
      if (isAuthorized) {
        this.setToken(this.accessToken!);
        this.setIsAuthorized('yes');
      } else {
        await this.reIssueToken(this.userId!, this.refreshToken!);
      }
    } else {
      this.setIsAuthorized('no');
    }
  }

  async signIn(username: string, password: string, isChecked: boolean): Promise<SignResult> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        username,
        password,
      }),
    };

    const response = await fetch(`${this.urlBase}/auth/sign_in`, requestOptions);
    const result: SignResponse = { status: response.status, ...(await response.json()) };
    return this.setTokenFromResponse(result, isChecked);
  }

  signOut() {
    const storage = this.window.localStorage.getItem('stored') ? 'localStorage' : 'sessionStorage';

    this.window[storage].removeItem('accessToken');
    this.window[storage].removeItem('refreshToken');
    this.window[storage].removeItem('expiredTime');
    this.window[storage].removeItem('userId');
    this.window.localStorage.removeItem('stored');

    this.accessToken = undefined;
    this.refreshToken = undefined;
    this.expiredTime = undefined;
    this.userId = undefined;
    this.setIsAuthorized('no');
    this.setToken('');
  }

  async reIssueToken(userId: string, refreshToken: string): Promise<SignResult> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        userId,
        refreshToken,
      }),
    };
    const response = await fetch(`${this.urlBase}/auth/reissue_token`, requestOptions);
    const result: SignResponse = { status: response.status, ...(await response.json()) };
    if (result.status === 401) {
      this.signOut();
    }
    return this.setTokenFromResponse(result);
  }

  private isAccessTokenExpired(expiredTime?: string) {
    if (!expiredTime) {
      return true;
    }

    if (this.date!.getTime() / 1000 >= parseInt(expiredTime)) {
      return true;
    } else {
      return false;
    }
  }
  private setMembersFromStorage() {
    const storage =
      window.localStorage.getItem('stored') === 'localStorage' ? 'localStorage' : 'sessionStorage';

    this.stored = storage;
    this.accessToken = window[storage].getItem('accessToken')!;
    this.refreshToken = window[storage].getItem('refreshToken')!;
    this.expiredTime = window[storage].getItem('expiredTime')!;
    this.userId = window[storage].getItem('userId')!;
  }
  private setStorageFromMembers() {
    window.localStorage.setItem('stored', this.stored!);
    window[this.stored!].setItem('accessToken', this.accessToken!);
    window[this.stored!].setItem('refreshToken', this.refreshToken!);
    window[this.stored!].setItem('expiredTime', this.expiredTime!);
    window[this.stored!].setItem('userId', this.userId!);
  }
  private setTokenFromResponse(result: SignResponse, isChecked?: boolean): SignResult {
    if (result.status === 201) {
      this.accessToken = result.accessToken;
      this.refreshToken = result.refreshToken;
      this.expiredTime = (this.date!.getTime() / 1000 + result.expiresIn!)?.toString(); //cannot set int in storage
      this.userId = result.userId?.toString(); //cannot set int in storage
      if (typeof isChecked === 'boolean') {
        this.stored = isChecked ? 'localStorage' : 'sessionStorage';
      }

      this.setStorageFromMembers();

      this.setToken(this.accessToken!);
      this.setIsAuthorized('yes');
    } else {
      console.error(result.message);
    }

    return {
      status: result.status,
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiredTime: this.expiredTime,
      userId: this.userId,
      message: result.message,
    };
  }
}
