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

export const usernameFilterConstructor = (auth: AuthService) => {
  return async (str: string): Promise<boolean> => {
    if (str.length >= 6 && str.length <= 30) {
      return await auth.checkValidUsername(str);
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
