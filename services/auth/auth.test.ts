import AuthService from './auth';

describe('AuthService', () => {
  const timeStd = 1466424490000;
  const setCode = (code: number) => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          status: code,
          json: () => {
            return {};
          },
        });
      });
    });
  };
  let auth: AuthService;
  let date: Date;
  let setStatus: Function;
  beforeAll(() => {
    date = new Date(timeStd);
    date.getTime = () => timeStd;
    auth = AuthService.getInstance();
  });

  describe('init', () => {
    window.localStorage.setItem('stored', 'localStorage');
    window.localStorage.setItem('accessToken', 'token');

    it('has no expired time', () => {
      setStatus = jest.fn();
      auth.init('url', window, date, setStatus);
      expect(setStatus).toHaveBeenCalledWith({ token: 'token', isAuth: 'no' });
    });

    it('has expired time, and not expired', async () => {
      const expiredTime = timeStd + 10000;
      window.localStorage.setItem('expiredTime', expiredTime.toString());

      setStatus = jest.fn();

      await auth.init('url', window, date, setStatus);
      expect(setStatus).toHaveBeenCalledWith({ token: 'token', isAuth: 'yes' });
    });

    describe('has expired time, but expired', () => {
      beforeEach(() => {
        const expiredTime = timeStd - 1000;
        window.localStorage.setItem('stored', 'localStorage');
        window.localStorage.setItem('expiredTime', expiredTime.toString());
      });
      it('has valid refresh token', async () => {
        setCode(201);
        setStatus = jest.fn();

        await auth.init('url', window, date, setStatus);
        expect(setStatus).toHaveBeenCalledWith({ token: undefined, isAuth: 'yes' });
        //this token is response from request with refresh token
      });
      it('has not valid refresh token', async () => {
        setCode(404);
        setStatus = jest.fn();

        await auth.init('url', window, date, setStatus);
        expect(setStatus).toHaveBeenCalledWith({ token: undefined, isAuth: 'no' });
        //this token is response from request with refresh token
      });
    });
  });

  beforeEach(async () => {
    window.localStorage.setItem('stored', 'localStorage');
    window.localStorage.setItem('accessToken', 'token');
    window.localStorage.setItem('userId', 'userId');
    setStatus = jest.fn();
    setCode(201);
    await auth.init('url', window, date, setStatus);
  });

  describe('signIn', () => {
    it('has valid user', async () => {
      setCode(201);
      expect(await auth.signIn('username', 'password', true)).toBe('success');
    });
    it('has not valid user', async () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve({
            status: 404,
            json: () => {
              return { message: 'failed' };
            },
          });
        });
      });
      expect(await auth.signIn('username', 'password', true)).toBe('failed');
    });
  });

  describe('signOut', () => {
    it('set isAUth no', () => {
      auth.signOut();
      expect(setStatus).toHaveBeenCalledWith({ token: undefined, isAuth: 'no' });
    });
  });

  describe('getUserId', () => {
    it('returns userId', () => {
      expect(auth.getUserId()).toBe('userId');
    });
  });
});
