import * as React from 'react';
import { SFC } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Title } from '../routing/Title';
import { AuthProvider } from '../components/AuthContext';
import { Analytics } from './Analytics';
import { Navigation } from './Navigation';

export const App: SFC<{}> = () => (
    <AuthProvider>
        <Title>Cash desk</Title>
        <div className="App flex column">
            <main className="view flex column grow">
                <Routes />
            </main>
            <Navigation />
            <Analytics />
        </div>
    </AuthProvider>
);
