import * as React from 'react';
import { ReactElement, Component, createContext } from 'react';

export type ModalContent = ReactElement<{}> | null;

export interface IModalProviderState {
    isOpen: boolean;
    content: ModalContent;
    open: (newContent: ModalContent) => void;
    close: () => void;
}

const { Provider, Consumer } = createContext<IModalProviderState>({
    isOpen: false,
    content: null,
    open: () => null,
    close: () => {},
});

export class ModalProvider extends Component<{}, IModalProviderState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            isOpen: false,
            content: null,
            open: this.open,
            close: this.close,
        };
    }

    open = (newContent: ModalContent) =>
        this.setState({ isOpen: true, content: newContent });

    close = () => this.setState({ isOpen: false });

    render() {
        return (
            <Provider value={{ ...this.state }}>{this.props.children}</Provider>
        );
    }
}

export const ModalConsumer = Consumer;
