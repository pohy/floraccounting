import * as React from 'react';
import { Component, Fragment } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Title } from '../routing/Title';
import { NavLink } from '../routing/Link';
import { AuthConsumer, AuthProvider } from '../user/AuthContext';

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
                        {/* TODO: className */}
                        <NavLink to="/history">History</NavLink>
                        <AuthConsumer>
                            {({ user }) =>
                                user ? (
                                    <Fragment>
                                        <NavLink to="/order">New order</NavLink>
                                        <NavLink to="/user">Me</NavLink>
                                    </Fragment>
                                ) : (
                                    <NavLink to="/login">Login</NavLink>
                                )
                            }
                        </AuthConsumer>
                    </footer>
                </div>
            </AuthProvider>
        );
    }
}
