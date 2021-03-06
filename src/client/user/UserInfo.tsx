import * as React from 'react';
import { SFC } from 'react';
import { Redirect } from '../routing/Redirect';
import { Link } from '../routing/Link';
import { AuthConsumer } from '../components/AuthContext';
import { Title } from '../routing/Title';
import { Img } from '../components/Img';

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
                                className="badge-large"
                                src={user.profilePictureURL}
                                alt={user.name}
                            />
                        )}
                    </div>
                    <Link className="button margin-top-2x" to="/logout">
                        Logout ️️🚶‍🚪
                    </Link>
                    <div className="flex grow" />
                    <div className="flex center-content">
                        <Link to="/privacy-policy">Privacy policy</Link>
                    </div>
                </div>
            ) : (
                <Redirect to="/login" />
            )
        }
    </AuthConsumer>
);
