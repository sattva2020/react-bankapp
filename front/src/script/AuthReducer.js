export interface IUser {
  confirm: boolean;
  // другие свойства...
}

export interface IAuthState {
  token: string | null;
  user: IUser | null;
}

type ActionType =
  | { type: 'LOGIN'; payload: { token: string; user: IUser } }
  | { type: 'LOGOUT' };

export const authReducer = (state: IAuthState, action: ActionType) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};
