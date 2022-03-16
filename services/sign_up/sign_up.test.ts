import SignUpService, { SignUpErrorValues, SignUpValues } from './sign_up';

describe('SignUpService', () => {
  const setFetch = (bool: boolean) => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({
          json: () => {
            return {
              isValid: bool,
            };
          },
        });
      });
    });
  };
  const setStatus = (code: number) => {
    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({ status: code });
      });
    });
  };

  describe('userNameFilter', () => {
    const newFilter = SignUpService.usernameFilter('fakeURL');

    it('has empty username', async () => {
      expect(await newFilter('')).toBe('Please fill up username.');
    });
    it('has non-english username', async () => {
      expect(await newFilter('유저')).toBe('Only Enlglish username is availabe.');
    });
    it('has too short username', async () => {
      expect(await newFilter('abc')).toBe('Choose a username 6 - 20 characters long.');
    });
    it('has too long username', async () => {
      expect(await newFilter('abcdefghijklmnopqurstuvwxyz')).toBe(
        'Choose a username 6 - 20 characters long.'
      );
    });
    it('has username already taken', async () => {
      setFetch(false);
      const username = 'abcdef';
      expect(await newFilter(username)).toBe(`The username, ${username}, is already exist.`);
    });
    it('has valid username', async () => {
      setFetch(true);
      expect(await newFilter('abcdef')).toBe(undefined);
    });
  });

  describe('passwordFilter', () => {
    //Choose a password 8 - 20 characters including at least a letter, a number and a special character (!@#$%^&*).

    it('has empty password', () => {
      expect(SignUpService.passwordFilter('')).toBe('Please fill up password');
    });
    it('has too short password', () => {
      expect(SignUpService.passwordFilter('123')).toBe('Password is not valid.');
    });
    it('has too long password', () => {
      expect(SignUpService.passwordFilter('12345678901234567890123')).toBe(
        'Password is not valid.'
      );
    });
    it('has only number password', () => {
      expect(SignUpService.passwordFilter('1234567890')).toBe('Password is not valid.');
    });
    it('has right password', () => {
      expect(SignUpService.passwordFilter('1234!@#$abcd')).toBe(undefined);
    });
  });

  describe('confirmPasswordFilterConstructor', () => {
    const confirmPasswordFilter = SignUpService.confirmPasswordFilterConstructor('abc123!@#');

    it('has empty confirm password', () => {
      expect(confirmPasswordFilter('')).toBe('Please fill up confirm password');
    });

    it('has different confirm password', () => {
      expect(confirmPasswordFilter('abc123!')).toBe('Password does not match.');
    });

    it('has same confirm password', () => {
      expect(confirmPasswordFilter('abc123!@#')).toBe(undefined);
    });
  });

  describe('emailNameFilter', () => {
    const newFilter = SignUpService.emailFilter('fakeURL');

    it('has empty email address', async () => {
      expect(await newFilter('')).toBe('Please fill up email address.');
    });
    it('has wrong email style', async () => {
      expect(await newFilter('abcde')).toBe('The email address is not valid.');
    });
    it('has email address already taken', async () => {
      setFetch(false);
      expect(await newFilter('abc@gmail.com')).toBe('This email address is already taken.');
    });
    it('has valid email address', async () => {
      setFetch(true);
      expect(await newFilter('abc@gmail.com')).toBe(undefined);
    });
  });

  describe('validateSignUp', () => {
    let newFilter: (values: SignUpValues) => Promise<SignUpErrorValues>;
    let values: SignUpValues;

    beforeEach(() => {
      newFilter = SignUpService.validateSignUp('fakeURL');
      values = {
        username: 'chwj1212',
        password: '123!@#abc',
        confirmPassword: '123!@#abc',
        email: 'abc@gmail.com',
        firstName: 'Won',
        lastName: 'Cho',
        gender: 'male',
        birthday: '1990-01-01',
        phoneNumberPrefix: '020',
        phoneNumber: '32341233',
        district: 'Auckland',
        suburb: 'Albany',
      };
    });

    it('has valid values', async () => {
      setFetch(true);
      expect(await newFilter(values)).toEqual({});
    });
    it('has wrong username', async () => {
      values.username = '';
      expect((await newFilter(values)).username).not.toBeFalsy();
    });
    it('has wrong password', async () => {
      values.password = '';
      expect((await newFilter(values)).password).not.toBeFalsy();
    });
    it('has wrong confirm password', async () => {
      values.password = 'abc123!@#';
      values.confirmPassword = '123abc!@#';
      expect((await newFilter(values)).confirmPassword).not.toBeFalsy();
    });
    it('has wrong email', async () => {
      values.email = '';
      expect((await newFilter(values)).email).not.toBeFalsy();
    });
    it('has wrong firstName', async () => {
      values.firstName = '';
      expect((await newFilter(values)).firstName).not.toBeFalsy();
    });
    it('has wrong lastName', async () => {
      values.lastName = '';
      expect((await newFilter(values)).lastName).not.toBeFalsy();
    });
    it('has wrong gender', async () => {
      values.gender = '';
      expect((await newFilter(values)).gender).not.toBeFalsy();
    });
    it('has wrong birthday', async () => {
      values.birthday = '';
      expect((await newFilter(values)).birthday).not.toBeFalsy();
    });
    it('has wrong phoneNumberPrefix', async () => {
      values.phoneNumberPrefix = '';
      expect((await newFilter(values)).phoneNumberPrefix).not.toBeFalsy();
    });
    it('has wrong phoneNumber', async () => {
      values.phoneNumber = '';
      expect((await newFilter(values)).phoneNumber).not.toBeFalsy();
    });
  });

  describe('handleSubmit', () => {
    const values: SignUpValues = {
      username: 'chwj1212',
      password: '123!@#abc',
      confirmPassword: '123!@#abc',
      email: 'abc@gmail.com',
      firstName: 'Won',
      lastName: 'Cho',
      gender: 'male',
      birthday: '1990-01-01',
      phoneNumberPrefix: '020',
      phoneNumber: '32341233',
      district: 'Auckland',
      suburb: 'Albany',
    };
    let push: Function;
    let newSubmitHandler: (values: SignUpValues) => Promise<void>;
    beforeEach(() => {
      push = jest.fn();
      newSubmitHandler = SignUpService.handleSubmit('fakeURL', push);
    });

    it('has 201 code', async () => {
      setStatus(201);
      await newSubmitHandler(values);
      expect(push).toHaveBeenCalled();
    });
    it('has 404 code', async () => {
      setStatus(404);
      await newSubmitHandler(values);
      expect(push).not.toHaveBeenCalled();
    });
  });
});
