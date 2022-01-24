interface Result {
  status: number;
  message?: string;
  token?: string;
  username?: string;
}

export default class AuthService {
  constructor() {}

  async signIn(username: string, password: string) {
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
    const result: Result = { status: response.status, ...(await response.json()) };

    return result;
  }
}
