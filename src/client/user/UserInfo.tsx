import * as React from 'react';
import { SFC } from 'react';
import { Redirect } from '../routing/Redirect';
import { Link } from '../routing/Link';
import { AuthConsumer } from './AuthContext';
import { Title } from '../routing/Title';
import { Img } from '../common/Img';

import './UserInfo.css';

export const UserInfo: SFC<{}> = () => (
    <AuthConsumer>
        {({ user }) =>
            user ? (
                <div className="UserInfo padding-2x flex column grow">
                    <Title>Me</Title>
                    <div className="flex row">
                        <div className="grow">
                            <h2>{user.name}</h2>
                            <h4>{user.email}</h4>
                        </div>
                        {user.profilePictureURL && (
                            <Img
                                className="badge"
                                src={user.profilePictureURL}
                                alt={user.name}
                            />
                        )}
                    </div>
                    <Link className="button margin-top-2x" to="/logout">
                        Logout
                    </Link>
                </div>
            ) : (
                <Redirect to="/login" />
            )
        }
    </AuthConsumer>
);
