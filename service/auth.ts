export interface SignInResponse {
  status: number;
  accessToken?: string;
  refreshToken?: string;
  expiredTime?: string;
  userId?: string;
  message?: string;
} // Sanitized values from response of sign in API

export default class AuthService {
  private date!: Date;
  private setToken!: Function;
  private setIsAuthorized!: Function;
  private window!: Window;

  public accessToken: string | undefined;
  public refreshToken: string | undefined;
  public expiredTime: string | undefined;
  public userId: string | undefined;

  constructor() {}

  init(setToken: Function, setIsAuthorized: Function, window: Window, date: Date) {
    this.setToken = setToken;
    this.setIsAuthorized = setIsAuthorized;
    this.window = window;
    this.date = date;
    this.setMembers();

    const isAuthorized = !this.isTokenExpired(this.expiredTime!); // if it is expired, it is not authorized.
    this.setToken(this.accessToken);
    this.setIsAuthorized(isAuthorized);
  }

  async signIn(username: string, password: string, isChecked: boolean): Promise<SignInResponse> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      username,
      password,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch('http://localhost:8080/auth/sign_in', requestOptions);
    const result: {
      status: number;
      message?: string;
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user_id?: number;
    } = { status: response.status, ...(await response.json()) };

    if (result.status === 201) {
      this.accessToken = result.access_token;
      this.refreshToken = result.refresh_token;
      this.expiredTime = (this.date!.getTime() / 1000 + result.expires_in!)?.toString();
      this.userId = result.user_id?.toString();
      this.setToken(this.accessToken!);
      this.setIsAuthorized(true);

      const storage = isChecked ? 'localStorage' : 'sessionStorage';
      this.window.localStorage.setItem('stored', storage);
      this.window[storage].setItem('token', this.accessToken!);
      this.window[storage].setItem('refresh_token', this.refreshToken!);
      this.window[storage].setItem('expired_time', this.expiredTime!); //cannot set int in storage
      this.window[storage].setItem('user_id', this.userId!); //cannot set int in storage
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

  signOut() {
    const storage = this.window.localStorage.getItem('stored') ? 'localStorage' : 'sessionStorage';

    this.window[storage].removeItem('token')!;
    this.window[storage].removeItem('refresh_token')!;
    this.window[storage].removeItem('expired_time')!;
    this.window[storage].removeItem('user_id')!;
    this.window.localStorage.removeItem('stored')!;

    this.setMembers();
    this.setIsAuthorized(false);
  }

  private isTokenExpired(expiredTime?: string) {
    if (!expiredTime) {
      return true;
    }

    if (this.date!.getTime() / 1000 >= parseInt(expiredTime)) {
      return true;
    } else {
      return false;
    }
  }

  private setMembers() {
    const storage = window.localStorage.getItem('stored') ? 'localStorage' : 'sessionStorage';

    this.accessToken = window[storage].getItem('token')!;
    this.refreshToken = window[storage].getItem('refresh_token')!;
    this.expiredTime = window[storage].getItem('expired_time')!;
    this.userId = window[storage].getItem('user_id')!;
  }
}
