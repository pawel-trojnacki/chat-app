import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ThemeStyle from './theme/Theme';
import { routes } from './routes/routes';
import AppRoute from './components/AppRoute/AppRoute';
import { AuthProvider } from './context/context';
import UserTemplate from './templates/UserTemplate';
import Auth from './pages/Auth';

const App = () => {
  return (
    <div className="App">
      <ThemeStyle>
        <AuthProvider>
          <main>
            <Switch>
              <Route path="/" exact component={Auth} />
              <Route path="/dashboard/:path?" exact>
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

            {/* <Switch>
              <AppRoute exact path="/" component={Auth} isPrivate={false} />
              <UserTemplate>
                {routes.map(({ path, component, isPrivate }) => (
                  <AppRoute
                    key={path}
                    path={path}
                    component={component}
                    isPrivate={isPrivate}
                    exact
                  />
                ))}
              </UserTemplate>
            </Switch> */}
          </main>
        </AuthProvider>
      </ThemeStyle>
    </div>
  );
};

export default App;
