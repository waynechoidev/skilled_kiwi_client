import { SignUpValues } from '../../data/user';

interface SignInResult {
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  expiredTime?: string;
  userId?: string;
}

type Updater = (str: String) => String;

export default class AuthService {
  private date!: Date;
  private setToken!: Updater;
  private setIsAuthorized!: Updater;
  private window!: Window;

  private accessToken?: string;
  private refreshToken?: string;
  private expiredTime?: string;
  private userId?: string;
  private stored?: 'localStorage' | 'sessionStorage';

  private urlBase: string;
  static _instance: AuthService;

  private constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  public async init(setToken: Updater, setIsAuthorized: Updater, window: Window, date: Date) {
    this.setToken = setToken;
    this.setIsAuthorized = setIsAuthorized;
    this.window = window;
    this.date = date;
    this.setMembersFromStorage();

    if (this.expiredTime) {
      const isAuthorized = !this.isAccessTokenExpired(this.expiredTime);
      // if it is expired, it is not authorized.
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
  public async signIn(
    username: string,
    password: string,
    isChecked: boolean
  ): Promise<string | undefined> {
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
    const result: SignInResult = await response.json();
    if (response.status > 199 && response.status < 300) {
      this.setTokenFromResponse(result, isChecked);
      return 'success';
    } else {
      return result.message;
    }
  }
  public async signUp(values: SignUpValues) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
    };

    const response = await fetch(`${this.urlBase}/auth/sign_up`, requestOptions);
    return response.status;
  }
  public signOut() {
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
  private async reIssueToken(userId: string, refreshToken: string): Promise<string | undefined> {
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
    const result: SignInResult = await response.json();

    if (response.status > 199 && response.status < 300) {
      this.setTokenFromResponse(result);
      return 'success';
    } else {
      this.signOut();
      return result.message;
    }
  }
  private isAccessTokenExpired(expiredTime?: string) {
    if (!expiredTime) {
      return true;
    }

    if (this.date!.getTime() >= parseInt(expiredTime)) {
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
  private setTokenFromResponse(result: SignInResult, isChecked?: boolean) {
    this.accessToken = result.accessToken;
    this.refreshToken = result.refreshToken;
    this.expiredTime = result.expiredTime;
    this.userId = result.userId;
    if (typeof isChecked === 'boolean') {
      this.stored = isChecked ? 'localStorage' : 'sessionStorage';
    }

    this.setStorageFromMembers();

    this.setToken(this.accessToken!);
    this.setIsAuthorized('yes');
  }

  public static getInstance(urlBase: string) {
    return this._instance || (this._instance = new this(urlBase));
  }
}
