import * as React from 'react';
import { SFC } from 'react';
import './Modal.css';
import { ModalConsumer, IModalProviderState } from './ModalContext';

export const Modal: SFC<{}> = () => (
    <ModalConsumer>
        {({ content, isOpen }: IModalProviderState) =>
            isOpen ? (
                <div className="Modal flex-default grow center-content">
                    {content}
                </div>
            ) : null
        }
    </ModalConsumer>
);
