import { SFC, Fragment } from 'react';
import React from 'react';
import { API_URL } from '../common/http';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer } from './AuthContext';
import { Title } from '../routing/Title';

export const Login: SFC<{}> = () => (
    <AuthConsumer>
        {({ user }) =>
            user ? (
                <Redirect to="/" />
            ) : (
                <Fragment>
                    <Title>Login</Title>
                    <h2>Log in to create a new order</h2>
                    <a className="button primary" href={`${API_URL}/login/fb`}>
                        Login with Facebook
                    </a>
                </Fragment>
            )
        }
    </AuthConsumer>
);
