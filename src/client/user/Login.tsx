import { SFC } from 'react';
import React from 'react';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer, IAuthProviderState } from '../components/AuthContext';
import { Title } from '../routing/Title';
import { browserHistory } from '../routing/browser-history';
import './Login.css';
import { HTTP } from '../common/http';
import { Link } from '../routing/Link';

export const Login: SFC<{}> = () => (
    <AuthConsumer>
        {({ user }: IAuthProviderState) =>
            user ? (
                <Redirect
                    to={
                        browserHistory.lastState.from
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
                        href={`${HTTP.ApiURL}/login/fb`}
                    >
                        Login with <strong className="fb">Facebook</strong>
                    </a>
                    <div className="flex grow" />
                    <div className="flex center-content">
                        <Link to="/privacy-policy">Privacy policy</Link>
                    </div>
                </div>
            )
        }
    </AuthConsumer>
);
