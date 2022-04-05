type SignInResult = {
  message?: string;
  accessToken: string;
  refreshToken: string;
  expiredTime: string;
  userId: string;
};
export type AuthStatus = {
  token: string;
  isAuth: 'yes' | 'no' | '';
};

export default class AuthService {
  private urlBase!: string;
  private date!: Date;
  private setStatus!: Function;
  private window!: Window;

  private accessToken?: string;
  private refreshToken?: string;
  private expiredTime?: string;
  private userId?: string;
  private stored?: 'localStorage' | 'sessionStorage';
  private isAuth?: 'yes' | 'no' | '';

  static _instance: AuthService;

  private constructor() {}

  public async init(urlBase: string, window: Window, date: Date, setStatus: Function) {
    this.urlBase = urlBase;
    this.setStatus = setStatus;
    this.window = window;
    this.date = date;
    this.setMembersFromStorage();

    if (this.expiredTime) {
      const isAuth = !this.isAccessTokenExpired(this.expiredTime);
      // if it is expired, it is not authorized.
      if (isAuth) {
        this.isAuth = 'yes';
        this.update();
      } else {
        await this.reIssueToken(this.userId!, this.refreshToken!);
      }
    } else {
      this.isAuth = 'no';
      this.update();
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
      this.setMembersFromResponse(result, isChecked);
      this.setStorageFromMembers();
      this.update();
      return 'success';
    } else {
      return result.message;
    }
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
    this.isAuth = 'no';
    this.update();
  }
  public getUserId() {
    return this.userId;
  }

  private async reIssueToken(userId: string, refreshToken: string): Promise<void> {
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
      this.setMembersFromResponse(result);
      this.setStorageFromMembers();
      this.update();
    } else {
      this.signOut();
    }
  }
  private isAccessTokenExpired(expiredTime: string) {
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
  private setMembersFromResponse(result: SignInResult, isChecked?: boolean) {
    this.accessToken = result.accessToken;
    this.refreshToken = result.refreshToken;
    this.expiredTime = result.expiredTime;
    this.userId = result.userId;
    if (typeof isChecked === 'boolean') {
      this.stored = isChecked ? 'localStorage' : 'sessionStorage';
    }

    this.isAuth = 'yes';
  }
  private update() {
    const status: AuthStatus = { token: this.accessToken!, isAuth: this.isAuth! };
    this.setStatus(status);
  }

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }
}
