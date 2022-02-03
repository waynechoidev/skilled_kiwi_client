import { CompulsoryParameter } from '../data/sign_up';
import AuthService from './auth';

export const inputHandlerConstructor = (
  setItem: React.Dispatch<React.SetStateAction<string>>,
  setValid?: React.Dispatch<React.SetStateAction<boolean>>,
  filter?: (str: string) => Promise<boolean>
): React.ChangeEventHandler<HTMLInputElement> => {
  return (e) => {
    const currentValue = e.target.value.replaceAll(' ', '');
    setItem(currentValue);

    if (setValid && filter) {
      setTimeout(async () => {
        setValid(await filter(currentValue));
      }, 500);
    }
  };
};

export const usernameFilterConstructor = (
  auth: AuthService,
  setIsUsernameUnique: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (str: string): Promise<boolean> => {
    if (str.length >= 6 && str.length <= 20) {
      const checkUsername = await auth.checkValidUsername(str);
      setIsUsernameUnique(checkUsername);
      return checkUsername;
    } else {
      return false;
    }
  };
};

export const passwordFilter = async (str: string) => {
  return /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$/.test(str);
};

export const confirmPasswordFilterConstructor = (isPasswordValid: boolean, password: string) => {
  return async (str: string) => {
    return isPasswordValid ? str === password : false;
  };
};

export const emailFilterConstructor = (
  auth: AuthService,
  setIsEmailUnique: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (str: string): Promise<boolean> => {
    if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(str)) {
      const checkEmail = await auth.checkValidEmail(str);
      setIsEmailUnique(checkEmail);
      return checkEmail;
    } else {
      return false;
    }
  };
};

export const handleSubmitConstructor = (
  auth: AuthService,
  username: string,
  password: string,
  email: string,
  firstName: string,
  lastName: string,
  gender: string,
  birthday: string,
  phoneNumberPrefix: string,
  phoneNumber: string,
  district: string,
  suburb: string,
  setIsError: React.Dispatch<React.SetStateAction<CompulsoryParameter[]>>,
  isUsernameValid: boolean,
  isUsernameUnique: boolean,
  isPasswordValid: boolean,
  isConfirmPasswordValid: boolean,
  isEmailValid: boolean,
  isEmailUnique: boolean,
  setIsSubmitValid: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitValid(true);
    setIsError([]);

    if (
      isUsernameValid &&
      isUsernameUnique &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isEmailValid &&
      isEmailUnique &&
      firstName &&
      lastName &&
      gender &&
      birthday &&
      phoneNumberPrefix &&
      phoneNumber &&
      district &&
      suburb
    ) {
      const result = await auth.signUp(
        username,
        password,
        email,
        firstName,
        lastName,
        gender,
        birthday,
        phoneNumberPrefix,
        phoneNumber,
        district,
        suburb
      );
      console.log(result);
    } else {
      setIsSubmitValid(false);
      isUsernameValid || setIsError((isError) => [...isError, 'username']);
      isPasswordValid || setIsError((isError) => ['password', ...isError]);
      isConfirmPasswordValid || setIsError((isError) => ['confirmPassword', ...isError]);
      isEmailValid || setIsError((isError) => ['email', ...isError]);
      firstName || setIsError((isError) => [...isError, 'firstName']);
      lastName || setIsError((isError) => ['lastName', ...isError]);
      gender || setIsError((isError) => ['gender', ...isError]);
      birthday || setIsError((isError) => ['birthday', ...isError]);
      phoneNumberPrefix || setIsError((isError) => ['phoneNumberPrefix', ...isError]);
      phoneNumber || setIsError((isError) => ['phoneNumber', ...isError]);
      district || setIsError((isError) => ['district', ...isError]);
      suburb || setIsError((isError) => ['suburb', ...isError]);
    }
  };
};
