// components/PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuthToken } from 'axios_helper.js'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = !!getAuthToken();

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/auth/sign-in" />
                )
            }
        />
    );
};

export default PrivateRoute;
