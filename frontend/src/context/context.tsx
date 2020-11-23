import React, {
  createContext,
  FC,
  ReactNode,
  useReducer,
  Dispatch,
} from 'react';

export interface AuthStateType {
  isAuthenticated: boolean;
  token: null | string;
  user: null | string;
}

export enum AuthActionTypes {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
}

export interface AuthActions {
  type: string;
  payload?: AuthStateType;
}

const initialState: AuthStateType = {
  isAuthenticated: !!(
    localStorage.getItem('user') && localStorage.getItem('token')
  ),
  user: localStorage.getItem('user') || null,
  token: localStorage.getItem('token') || null,
};

export const AuthContext = createContext<{
  state: AuthStateType;
  dispatch: Dispatch<AuthActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AuthReducer = (state: AuthStateType, action: AuthActions) => {
  switch (action.type) {
    case AuthActionTypes.Login:
      localStorage.setItem('user', JSON.stringify(action.payload!.user));
      localStorage.setItem('token', JSON.stringify(action.payload!.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload!.user,
        token: action.payload!.user,
      };
    case AuthActionTypes.Logout:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
