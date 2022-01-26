export interface SignInResponse {
  status: number;
  accessToken?: string;
  refreshToken?: string;
  expiredTime?: string;
  userId?: string;
  message?: string;
}

export default class AuthService {
  private date: Date | undefined;
  public accessToken: string | undefined;
  public refreshToken: string | undefined;
  public expiredTime: string | undefined;
  public userId: string | undefined;

  public isAuthorized: boolean = false;

  constructor() {}

  init(
    date: Date,
    accessToken?: string,
    refreshToken?: string,
    expiredTime?: string,
    userId?: string
  ) {
    this.date = date;
    if (!expiredTime) {
      return false;
    }
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiredTime = expiredTime;
    this.userId = userId;
    this.isAuthorized = !this.isTokenExpired(expiredTime); // if it is expired, it is not authorized.
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

  private isTokenExpired(expiredTime: string | null) {
    if (!expiredTime) {
      return false;
    }

    if (this.date!.getTime() / 1000 >= parseInt(expiredTime)) {
      return true;
    } else {
      return false;
    }
  }
}
