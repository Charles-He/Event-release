import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EngagementsPage from './pages/EngagementsPage';
import { useContext } from 'react';
import AuthContext from './store/auth-context';
import Subscription from './components/Engagements/Subscription';
import Users from './components/Engagements/Users';

function App() {
  const authContext = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage/>
        </Route>
        {!authContext.loggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="/engagements">
          {authContext.loggedIn && <EngagementsPage />}
          {!authContext.loggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="/subscription/:id">
          <Subscription />
        </Route>
        <Route path="/users/:id">
          <Users />
        </Route>
        <Route path="*">
          <Redirect to="/"/>
        </Route>
        
      </Switch>
    </Layout>
  );
}

export default App;
