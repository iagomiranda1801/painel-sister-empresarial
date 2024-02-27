import React from 'react';
import {Link, Route} from 'react-router-dom';
import {isAuthenticated} from "./Auth";

export const PrivateRoute = ({ component: Component, ...rest }) => (
   
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Link to={{ pathname: "/login", state: { from: props.location } }} />
            )
        }
    />
);