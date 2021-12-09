const passRegEx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const mailRegEx =
  /^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/;

module.exports.validateSignUpInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    if (!email.match(mailRegEx)) {
      errors.email = "Email must be in a regular format";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.password = "Password must match";
  } else if (!password.match(passRegEx)) {
    errors.password =
      "Password must match min. 8 character, with at least a symbol, upper and lower case letters and a number";
  }
  return {
    errors,
    notValid: Object.keys(errors).length >= 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    notValid: Object.keys(errors).length >= 1,
  };
};

module.exports.validateEditInput = (username, email, password, newPassword) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  } else if (username.length > 16) {
    errors.username = "Username must not be longer than 16 characters";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    if (!email.match(mailRegEx)) {
      errors.email = "Email must be in a regular format";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  if (!newPassword.match(passRegEx)) {
    errors.password =
      "Password must match min. 8 character, with at least a symbol, upper and lower case letters and a number";
  }
  return {
    errors,
    notValid: Object.keys(errors).length >= 1,
  };
};
