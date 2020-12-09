import React, {
  createContext,
  FC,
  ReactNode,
  useReducer,
  Dispatch,
} from 'react';

export interface AuthStateType {
  isAuthenticated?: boolean;
  user?: null | string;
  token?: null | string;
  userData?: any;
}

export enum AuthActionTypes {
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  SetUserData = 'SET_USER_DATA',
}

export interface AuthActions {
  type: string;
  payload?: AuthStateType;
}

const initialState: AuthStateType = {
  isAuthenticated: !!(
    localStorage.getItem('user') && localStorage.getItem('token')
  ),
  user: JSON.parse(localStorage.getItem('user') as string) || null,
  token: JSON.parse(localStorage.getItem('token') as string) || null,
  userData: null,
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
      const expiration = new Date(new Date().getTime() + 1000 * 36000);
      localStorage.setItem('user', JSON.stringify(action.payload!.user));
      localStorage.setItem('token', JSON.stringify(action.payload!.token));
      localStorage.setItem(
        'expiration',
        JSON.stringify(expiration.toISOString())
      );
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload!.user,
        token: action.payload!.token,
      };
    case AuthActionTypes.Logout:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case AuthActionTypes.SetUserData:
      return {
        ...state,
        userData: action.payload!.userData,
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
