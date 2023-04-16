import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotesPage from "../pages/NotesPage";
import LoginPage from "../pages/LoginPage";
import Registration from "../pages/Registration";
import PasswordRecovery from "../pages/PasswordRecovery";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import NavBar from "../component/NavBar";
import { useSelector } from "react-redux";
import "../css/errorMessage.css";

function Router() {
  const auth = useSelector((state) => state.auth_reducers);

  const Error = () => {
    return (
      <div className="containerError">
        <h1 className="errorMessage">
          &#9888;&#65039; Página não encontrada...
        </h1>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <PublicRoute
          isLogged={auth.isLogged}
          component={HomePage}
          path="/"
          exact
        />
        <PublicRoute
          isLogged={auth.isLogged}
          component={LoginPage}
          path="/login"
          exact
        />
        <PublicRoute
          isLogged={auth.isLogged}
          component={Registration}
          path="/registration"
        />
        <PublicRoute
          isLogged={auth.isLogged}
          component={PasswordRecovery}
          path="/recovery"
        />
        <PrivateRoute
          isLogged={auth.isLogged}
          component={NotesPage}
          path="/notes"
        />
        <Route component={Error} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
