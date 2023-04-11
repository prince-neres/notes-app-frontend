const initState = {
  isLogged: false,
  username: null,
  accessToken: null,
};

const auth_reducers = (state = initState, action) => {
  switch (action.type) {
    case "SUCCESS_LOGIN":
      return {
        ...state,
        isLogged: true,
        username: action.payload.username,
        accessToken: action.payload.accessToken,
      };
    case "SUCCESS_LOGOUT":
      return { ...state, isLogged: false, username: null, accessToken: null };
    default:
      return state;
  }
};

export default auth_reducers;
