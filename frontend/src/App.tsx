import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ThemeStyle from './theme/Theme';
import { routes } from './routes/routes';
import AppRoute from './components/AppRoute/AppRoute';
import { AuthProvider } from './context/AuthContext';
import UserTemplate from './templates/UserTemplate/UserTemplate';
import Auth from './pages/Auth';

const App = () => {
  return (
    <div className="App">
      <ThemeStyle>
        <AuthProvider>
          <main data-testid="main">
            <Switch>
              <Route path="/" exact component={Auth} />
              <Route path="/dashboard/:path?/:path?" exact>
                <UserTemplate>
                  <Switch>
                    {routes.map(({ path, component, isPrivate }) => (
                      <AppRoute
                        key={path}
                        path={path}
                        component={component}
                        isPrivate={isPrivate}
                      />
                    ))}
                  </Switch>
                </UserTemplate>
              </Route>
            </Switch>
          </main>
        </AuthProvider>
      </ThemeStyle>
    </div>
  );
};

export default App;
