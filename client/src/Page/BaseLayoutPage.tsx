import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { AuthProvider } from '../Context/AuthContext';
import { NotificationProvider } from '../Context/NotificationContext';
import PrivateRoute from '../Component/PrivateRoute';
import Spinner from '../Component/Spinner';

import NavBar from '../Component/NavBar';
import Header from '../Component/Header';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';

import './BaseLayoutPage.scss';

const BaseLayoutPage: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <Suspense fallback={Spinner}>
          <AuthProvider>
            <div className='base-layout'>
              <div className='nav-bar'>
                <NavBar />
              </div>
              <div className='header'>
                <Header />
              </div>
              <div className='content'>
                <Switch>
                  <Route path='/sign-up' component={SignUp} />
                  <Route path='/sign-in' component={SignIn} />
                  <PrivateRoute exact path='/' component={Home} />
                </Switch>
              </div>
            </div>
          </AuthProvider>
        </Suspense>
      </NotificationProvider>
    </Router>
  );
};

export default BaseLayoutPage;