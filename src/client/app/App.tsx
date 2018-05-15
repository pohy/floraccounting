import * as React from 'react';
import { Component, Fragment } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Title } from '../routing/Title';
import { AuthConsumer, AuthProvider } from '../components/AuthContext';
import { NavLink } from '../routing/NavLink';
import { Img } from '../components/Img';
import { Analytics } from './Analytics';

export class App extends Component<{}, {}> {
    render() {
        return (
            <AuthProvider>
                <Title>Cash desk</Title>
                <div className="App flex column">
                    <main className="view flex column grow">
                        <Routes />
                    </main>
                    {/* TODO: fix navigation in it's place */}
                    <footer className="navigation flex">
                        <NavLink className="grow button" to="/history">
                            History 📃
                        </NavLink>
                        <AuthConsumer>
                            {({ user }) =>
                                user ? (
                                    <Fragment>
                                        <NavLink
                                            className="grow button"
                                            to="/order"
                                        >
                                            New order 💸
                                        </NavLink>
                                        <NavLink
                                            className="grow button"
                                            to="/user"
                                        >
                                            {/* Me */}
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
                                    <NavLink
                                        className="grow button"
                                        to="/login"
                                    >
                                        Login
                                    </NavLink>
                                )
                            }
                        </AuthConsumer>
                    </footer>
                    <Analytics />
                </div>
            </AuthProvider>
        );
    }
}
