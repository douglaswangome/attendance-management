const usePasswordCheck = (password: string): string[] => {
  const strong = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  );
  const lowercase = new RegExp("(?=.*[a-z])");
  const uppercase = new RegExp("(?=.*[A-Z])");
  const digits = new RegExp("(?=.*[0-9])");
  const special = new RegExp("(?=.*[^A-Za-z0-9])");
  const length = new RegExp("(?=.{8,})");
  let errors = [];

  if (strong.test(password)) {
    errors = [];
  } else {
    if (!lowercase.test(password)) {
      errors.push("one lowercase character!");
    }
    if (!uppercase.test(password)) {
      errors.push("one uppercase character!");
    }
    if (!digits.test(password)) {
      errors.push("one digit!");
    }
    if (!special.test(password)) {
      errors.push("one special character!");
    }
    if (!length.test(password)) {
      errors.push("8 characters!");
    }
  }

  return errors;
};

export default usePasswordCheck;
