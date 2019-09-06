const INITIAL_STATE = {
  pages: null
};

const applySetPages = (state, action) => ({
  ...state,
  pages: action.pages
});

function messageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "PAGES_SET": {
      return applySetPages(state, action);
    }

    default:
      return state;
  }
}

export default messageReducer;
