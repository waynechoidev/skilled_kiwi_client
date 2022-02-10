import { SignUpErrorValues, SignUpValues } from '../data/sign_up';
const urlBase = 'http://localhost:8080';

///

export async function usernameFilter(username: string) {
  if (!username) {
    return 'Please fill up username';
  } else if (username.length < 6 || username.length > 20) {
    return 'Choose a username 6 - 20 characters long.';
  } else {
    if (!(await checkValidUsername(username))) {
      return `The username, ${username}, is already exist.`;
    }
  }
}

export function passwordFilter(password: string) {
  if (!password) {
    return 'Please fill up password';
  } else if (!/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(password)) {
    return 'Password is not valid.';
  }
}

export function confirmPasswordFilterConstructor(password: string) {
  return (confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Please fill up confirm password';
    } else if (password !== confirmPassword) {
      return 'Password does not match.';
    }
  };
}

export async function emailFilter(email: string) {
  if (!email) {
    return 'Please fill up email address.';
  } else if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    return 'The email address is not valid.';
  } else {
    if (!(await checkValidEmail(email))) {
      return `This email address is already taken.`;
    }
  }
}

export async function validateSignUp(values: SignUpValues) {
  const errors: SignUpErrorValues = {};

  const keys = Object.keys(values) as Array<keyof typeof values>;
  keys.forEach((i) => {
    if (!values[i]) {
      errors[i] = `Please fill up the ${i}`;
    }
  });

  const usernameError = await usernameFilter(values.username);
  if (usernameError) {
    errors.username = usernameError;
  }
  const passwordError = passwordFilter(values.password);
  if (passwordError) {
    errors.username = usernameError;
  }
  const confirmPasswordError = confirmPasswordFilterConstructor(values.password)(
    values.password[1]
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }
  const emailError = await emailFilter(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}

export async function signUp(values: SignUpValues) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(values),
  };

  const response = await fetch('http://localhost:8080/auth/sign_up', requestOptions);
  return response.status;
}
async function checkValidUsername(username: string): Promise<boolean> {
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

async function checkValidEmail(email: string): Promise<boolean> {
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
