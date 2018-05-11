import * as React from 'react';
import { User } from '../../common/model/User';
import { createContext, Component } from 'react';
import jwt_decode from 'jwt-decode';
import { updateToken } from '../common/http';

export const JWT_LOCAL_STORAGE_KEY = 'auth';

export interface IAuthProviderState {
    user: User | null;
    login: (token: string) => User | null;
    logout: () => User | null;
}

const { Provider, Consumer } = createContext<IAuthProviderState>({
    user: null,
    login: () => null,
    logout: () => null,
});

export class AuthProvider extends Component<{}, IAuthProviderState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            login: this.login,
            logout: this.logout,
            user: null,
        };
    }

    componentDidMount() {
        this.setState({
            user: this.login(
                window.localStorage.getItem(JWT_LOCAL_STORAGE_KEY),
            ),
        });
    }

    login = (token: string | null) => {
        updateToken(token);
        if (token) {
            const user = new User(jwt_decode(token));
            // TODO: token is invalid
            window.localStorage.setItem(JWT_LOCAL_STORAGE_KEY, token);
            this.setState({ user });
            return user;
        }
        return null;
    };

    logout = () => {
        updateToken(null);
        window.localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
        this.setState({ user: null });
        return null;
    };

    render() {
        return <Provider value={this.state}>{this.props.children}</Provider>;
    }
}

export const AuthConsumer = Consumer;
