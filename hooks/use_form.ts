import { ChangeEvent, useEffect, useState } from 'react';

type Filter = (value: string) => Promise<string | undefined> | string | undefined;

function useForm<Status, ErrorStatus>({
  initialValues,
  onSubmit,
  validate,
}: {
  initialValues: Status;
  onSubmit: (values: Status) => void;
  validate: (values: Status) => Promise<ErrorStatus> | ErrorStatus;
}) {
  const [values, setValues] = useState<Status>(initialValues);
  const [errors, setErrors] = useState<ErrorStatus>({} as ErrorStatus);
  const [isLoading, setIsLoading] = useState(false);
  const handleChange =
    (filter?: Filter) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let { name, value } = e.target;
      if (name === 'username') {
        value = value.toLowerCase();
      }
      setValues({ ...values, [name]: value });
      if (filter) {
        setTimeout(async () => {
          setErrors({ ...errors, [name]: await filter(value) });
        }, 500);
      }
    };

  const submitHandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(await validate(values));
    setIsLoading(true);
  };

  useEffect(() => {
    (async () => {
      if (isLoading) {
        if (Object.keys(errors).length === 0) {
          onSubmit(values);
        }
        setIsLoading(false);
      }
    })();
  }, [errors, isLoading]);

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    submitHandle,
  };
}

export default useForm;
