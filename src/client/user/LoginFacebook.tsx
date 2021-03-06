import * as React from 'react';
import { Component } from 'react';
import { browserHistory } from '../routing/browser-history';
import { AuthConsumer } from '../components/AuthContext';
import { Redirect } from '../routing/Redirect';
import { Title } from '../routing/Title';
import { Loading } from '../components/Loading';
import { http } from '../common/http';

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
            const token = (await http.get(
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
        return (
            <div className="flex grow center-content">
                <Title>Facebook login</Title>
                <Loading />
            </div>
        );
    }
}
