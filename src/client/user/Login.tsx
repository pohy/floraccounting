import { SFC, Fragment } from 'react';
import React from 'react';
import { API_URL } from '../common/http';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer } from './AuthContext';
import { Title } from '../routing/Title';
import { browserHistory } from '../routing/browser-history';
import './Login.css';

export const Login: SFC<{}> = () => (
    <AuthConsumer>
        {({ user }) =>
            user ? (
                <Redirect
                    to={
                        browserHistory.lastState
                            ? browserHistory.lastState.from
                            : '/'
                    }
                />
            ) : (
                <div className="Login flex column grow padding-2x">
                    <Title>Login</Title>
                    <div className="flex row">
                        <h2 className="grow">Floraccounting</h2>
                        <img
                            src="http://www.vilaflora.cz/concrete/themes/greek_yogurt/images/vila-flora-logo-2.png"
                            alt="Logo"
                        />
                    </div>
                    <a
                        className="button margin-top-2x"
                        href={`${API_URL}/login/fb`}
                    >
                        Login with <strong className="fb">Facebook</strong>
                    </a>
                </div>
            )
        }
    </AuthConsumer>
);
