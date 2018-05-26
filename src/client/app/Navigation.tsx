import React from 'react';
import { SFC, Fragment } from 'react';
import { NavLink } from '../routing/NavLink';
import { Img } from '../components/Img';
import { AuthConsumer } from '../components/AuthContext';

export const Navigation: SFC<{}> = () => (
    <footer className="navigation flex">
        <NavLink className="grow button" to="/history">
            <span className="hide-small">History </span>📃
        </NavLink>
        <AuthConsumer>
            {({ user }) =>
                user ? (
                    <Fragment>
                        <NavLink className="grow button" to="/order">
                            <span className="hide-small">New order </span>💸
                        </NavLink>
                        <NavLink className="grow button" to="/user">
                            {user.profilePictureURL ? (
                                <Img
                                    className="badge"
                                    src={user.profilePictureURL}
                                    alt={user.name || undefined}
                                />
                            ) : (
                                'Me'
                            )}
                        </NavLink>
                    </Fragment>
                ) : (
                    <NavLink className="grow button" to="/login">
                        Login
                    </NavLink>
                )
            }
        </AuthConsumer>
    </footer>
);
