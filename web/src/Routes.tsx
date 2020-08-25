import React from 'react';
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Bye } from "./pages/Bye";

export const Routes: React.FC = () => {
  return <BrowserRouter>
    <div>
      <header>
        <div>
          <div>
            <Link to='/'>Home Page</Link>
          </div>
          <div>
            <Link to='/register'>Register Page</Link>
          </div>
          <div>
            <Link to='/login'>Login Page</Link>
          </div>
          <div>
            <Link to='/bye'>Bye Page</Link>
          </div>
        </div>
      </header>
      <Switch>
        <Route exact path='/' component={ Home } />
        <Route exact path='/register' component={ Register } />
        <Route exact path='/login' component={ Login } />
        <Route exact path='/bye' component={ Bye } />
      </Switch>
    </div>

  </BrowserRouter> ;
};
