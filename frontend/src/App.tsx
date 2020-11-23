import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import ThemeStyle from './theme/Theme';
import { routes } from './routes/routes';
import AppRoute from './components/AppRoute/AppRoute';
import { AuthProvider } from './context/context';

const App = () => {
  return (
    <div className="App">
      <ThemeStyle>
        <AuthProvider>
          <Router>
            <main>
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
            </main>
          </Router>
        </AuthProvider>
      </ThemeStyle>
    </div>
  );
};

export default App;
