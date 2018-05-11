import { SFC } from 'react';
import React from 'react';
import { Redirect } from '../routing/Redirect';
import { AuthConsumer } from './AuthContext';

export const Logout: SFC<{}> = () => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <Redirect to="/login" />;
        }}
    </AuthConsumer>
);
