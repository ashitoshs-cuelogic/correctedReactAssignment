const INITIAL_STATE = {
  email: null,
  password: null,
  fullname: null,
  isAuthorised: false
};

function authReducer(state = INITIAL_STATE, action) {
  if (action.type === "onChange") {
    return {
      ...state,
      [action.name]: action.value
    };
  }

  if (action.type === "onSetAuthorise") {
    return {
      ...state,
      isAuthorised: action.status
    };
  }
  return state;
}

export default authReducer;
