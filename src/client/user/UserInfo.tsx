import * as React from 'react';
import { SFC, Fragment } from 'react';
import { Redirect } from '../routing/Redirect';
import { Link } from '../routing/Link';
import { AuthConsumer } from './AuthContext';
import { Title } from '../routing/Title';

export const UserInfo: SFC<{}> = () => (
    <AuthConsumer>
        {({ user }) =>
            user ? (
                <Fragment>
                    <Title>Me</Title>
                    <h2>{user.name}</h2>
                    <h4>{user.email}</h4>
                    <Link to="/logout">Logout</Link>
                </Fragment>
            ) : (
                <Redirect to="/login" />
            )
        }
    </AuthConsumer>
);
