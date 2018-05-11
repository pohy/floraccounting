import React from 'react';
import { Component } from 'react';
import { get } from '../common/http';
import { browserHistory } from '../routing/browser-history';
import { AuthConsumer } from './AuthContext';
import { Redirect } from '../routing/Redirect';

export interface ILoginFacebookState {
    token: string;
}

export class LoginFacebook extends Component<{}, ILoginFacebookState> {
    state = {
        token: '',
    };

    async componentDidMount() {
        const codeMatch = document.location.search.match(/code=(.+)/);
        if (!codeMatch) {
            browserHistory.push('/login');
        }
        const [, code] = codeMatch as RegExpMatchArray;
        try {
            const token = (await get(
                `/login/fb/exchange?code=${code}`,
            )) as string;
            this.setState({ token });
        } catch (error) {
            console.error(error);
            browserHistory.push('/login');
        }
    }

    render() {
        const { token } = this.state;
        if (token) {
            return (
                <AuthConsumer>
                    {({ login }) => {
                        login(token);
                        return <Redirect to="/" />;
                    }}
                </AuthConsumer>
            );
        }
        return <h2>Logging in...</h2>;
    }
}
