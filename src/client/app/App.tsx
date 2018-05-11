import * as React from 'react';
import { Component, Fragment } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Title } from '../routing/Title';
import { AuthConsumer, AuthProvider } from '../user/AuthContext';
import { NavLink } from '../routing/NavLink';

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
                        <NavLink className="grow" to="/history">History</NavLink>
                        <AuthConsumer>
                            {({ user }) =>
                                user ? (
                                    <Fragment>
                                        <NavLink className="grow" to="/order">New order</NavLink>
                                        <NavLink className="grow" to="/user">Me</NavLink>
                                    </Fragment>
                                ) : (
                                    <NavLink className="grow" to="/login">Login</NavLink>
                                )
                            }
                        </AuthConsumer>
                    </footer>
                </div>
            </AuthProvider>
        );
    }
}
