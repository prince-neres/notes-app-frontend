import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({
  isLogged: IsLogged,
  component: Component,
  restricted,
  ...rest
}) => {
  return (
    // restricted = false -> rota pública
    // restricted = true -> rota restrita
    <Route
      {...rest}
      render={(props) =>
        IsLogged ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
