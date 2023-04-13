export const SetLogin = (body) => {
  return {
    type: "SUCCESS_LOGIN",
    payload: body,
  };
};

export const SetLogout = () => {
  return {
    type: "SUCCESS_LOGOUT",
  };
};
