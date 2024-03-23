const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.token, user: action.user };
    case 'LOGOUT':
      return { ...state, token: '', user: null };
    case 'UPDATE_USER':
      return { ...state, user: action.user };
    default:
      return state;
  }
};

export default authReducer;
