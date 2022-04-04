import { District, Suburb } from '../user/user';

export type SignUpValues = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'diverse' | '';
  birthday: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  district: District;
  suburb: Suburb;
};
export type SignUpErrorValues = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthday?: string;
  phoneNumberPrefix?: string;
  phoneNumber?: string;
  district?: string;
  suburb?: string;
};

export default class SignUpService {
  private urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  public usernameFilter = () => {
    const checkValidUsername = this.checkValidUsername;
    const urlBase = this.urlBase;
    // arrow function of this is set when declaratin.
    // If I return a new arrow function with method with this(this.~), it set on runtime, and it should be undefined.

    return async (username: string) => {
      if (!username) {
        return 'Please fill up username.';
      } else if (RegExp(/[^a-z0-9]/).test(username)) {
        return 'Only Enlglish username is availabe.';
      } else if (username.length < 6 || username.length > 20) {
        return 'Choose a username 6 - 20 characters long.';
      } else {
        if (!(await checkValidUsername(username, urlBase))) {
          return `The username, ${username}, is already exist.`;
        }
      }
    };
  };

  public passwordFilter = (password: string) => {
    if (!password) {
      return 'Please fill up password';
    } else if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(password)) {
      return 'Password is not valid.';
    }
  };

  public confirmPasswordFilterConstructor = (password: string) => {
    return (confirmPassword: string) => {
      if (!confirmPassword) {
        return 'Please fill up confirm password';
      } else if (password !== confirmPassword) {
        return 'Password does not match.';
      }
    };
  };

  public emailFilter = () => {
    const checkValidEmail = this.checkValidEmail;
    const urlBase = this.urlBase;

    return async (email: string) => {
      if (!email) {
        return 'Please fill up email address.';
      } else if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
        return 'The email address is not valid.';
      } else {
        if (!(await checkValidEmail(email, urlBase))) {
          return `This email address is already taken.`;
        }
      }
    };
  };

  public validateSignUp = () => {
    const usernameFilter = this.usernameFilter;
    const passwordFilter = this.passwordFilter;
    const confirmPasswordFilterConstructor = this.confirmPasswordFilterConstructor;
    const emailFilter = this.emailFilter;
    const urlBase = this.urlBase;

    return async (values: SignUpValues) => {
      const errors: SignUpErrorValues = {};

      const keys = Object.keys(values) as Array<keyof typeof values>;
      keys.forEach((i) => {
        if (!values[i]) {
          errors[i] = `Please fill up the ${i}`;
        }
      });

      const usernameError = await usernameFilter()(values.username);
      if (usernameError) {
        errors.username = usernameError;
      }
      const passwordError = passwordFilter(values.password);
      if (passwordError) {
        errors.username = usernameError;
      }
      const confirmPasswordError = confirmPasswordFilterConstructor(values.password)(
        values.confirmPassword
      );
      if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
      }
      const emailError = await emailFilter()(values.email);
      if (emailError) {
        errors.email = emailError;
      }

      return errors;
    };
  };

  public handleSubmit = (push: Function) => {
    const signUp = this.signUp;
    const urlBase = this.urlBase;

    return async (values: SignUpValues) => {
      const result = await signUp(values, urlBase);
      if (result === 201) {
        push('/');
      }
    };
  };

  // private methods
  private async signUp(values: SignUpValues, urlBase: string) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(values),
    };

    const response = await fetch(`${urlBase}/auth/sign_up`, requestOptions);
    return response.status;
  }

  private async checkValidUsername(username: string, urlBase: string): Promise<boolean> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const response: { isValid: boolean } = await (
      await fetch(`${urlBase}/auth/check_username/${username}`, requestOptions)
    ).json();

    return response.isValid;
  }

  private async checkValidEmail(email: string, urlBase: string): Promise<boolean> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    const response: { isValid: boolean } = await (
      await fetch(`${urlBase}/auth/check_email/${email}`, requestOptions)
    ).json();

    return response.isValid;
  }
}
