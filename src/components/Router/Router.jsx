import { useLocation, Route, Switch } from "react-router-dom";
import React from "react";
import HomePage from "../../views/HomePage";
import LoginForm from "../auth/LoginForm";
import SignUpForm from "../auth/SignUpForm";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import PageNotFound from "../../views/PageNotFound";
function Router() {
  const loc = useLocation();

  return (
    <Switch location={loc}>
      <PrivateRoute component={HomePage} path="/" exact />

      <PublicRoute
        restricted={true}
        component={LoginForm}
        path="/LogIn"
        exact
      />
      <PublicRoute
        restricted={true}
        component={SignUpForm}
        path="/SignUp"
        exact
      />
      <Route>
        <PageNotFound></PageNotFound>
      </Route>
    </Switch>
  );
}

export default Router;
