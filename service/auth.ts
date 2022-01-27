export interface SignInResponse {
  status: number;
  accessToken?: string;
  refreshToken?: string;
  expiredTime?: string;
  userId?: string;
  message?: string;
}

export default class AuthService {
  private date: Date;
  public accessToken: string | undefined;
  public refreshToken: string | undefined;
  public expiredTime: string | undefined;
  public userId: string | undefined;

  public isAuthorized: boolean = false;

  constructor(date: Date) {
    this.date = date;
  }

  init(setToken: Function, setIsAuthorized: Function) {
    this.setMembers();
    this.isAuthorized = !this.isTokenExpired(this.expiredTime!); // if it is expired, it is not authorized.
    setToken(this.accessToken);
    setIsAuthorized(this.isAuthorized.toString());
  }

  async signIn(username: string, password: string): Promise<SignInResponse> {
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
      this.isAuthorized = true;
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

  signOut(setIsAuthorized: Function) {
    const storage = window.localStorage.getItem('stored') ? 'localStorage' : 'sessionStorage';

    window[storage].removeItem('token')!;
    window[storage].removeItem('refresh_token')!;
    window[storage].removeItem('expired_time')!;
    window[storage].removeItem('user_id')!;

    this.setMembers();
    this.isAuthorized = false;
    setIsAuthorized('false');
  }

  private isTokenExpired(expiredTime: string | null) {
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
