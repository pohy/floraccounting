import * as React from 'react';
import { SFC } from 'react';
import './App.css';
import { Routes } from '../routing/Routes';
import { Title } from '../routing/Title';
import { AuthProvider } from '../components/AuthContext';
import { Analytics } from './Analytics';
import { Navigation } from './Navigation';
import { Modal } from '../components/Modal';
import { ModalProvider } from '../components/ModalContext';

export const App: SFC<{}> = () => (
    <AuthProvider>
        <ModalProvider>
            <Title>Cash desk</Title>
            <div className="App flex column">
                <main className="view flex column grow">
                    <Routes />
                </main>
                <Navigation />
                <Analytics />
                <Modal />
            </div>
        </ModalProvider>
    </AuthProvider>
);
