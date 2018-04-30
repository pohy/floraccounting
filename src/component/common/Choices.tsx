import React from 'react';
import { Component } from 'react';
import './Choices.css';
import { Currencies } from '../../model/Transaction';

export interface IChoicesProps<T> {
    choices: T[];
    choiceName?: (choice: T) => string;
    isSelected: (choice: T) => boolean;
    onChoice: (choice: T) => void;
}

export class Choices<T> extends Component<IChoicesProps<T>, {}> {
    selectChoice = (choice: T) => () => this.props.onChoice(choice);

    renderChoice(choice: any) {
        if (typeof this.props.choiceName === 'function') {
            return this.props.choiceName(choice);
        }
        return choice;
    }

    render() {
        const { choices, isSelected } = this.props;
        return (
            <div className="Choices">
                {choices.map((choice, key) => (
                    <span
                        className={`choice${
                            isSelected(choice) ? ' selected' : ''
                        }`}
                        onClick={this.selectChoice(choice)}
                        {...{ key }}
                    >
                        {this.renderChoice(choice)}
                    </span>
                ))}
            </div>
        );
    }
}

export interface IChoicesCurrency {
    new (): Choices<Currencies>;
}
export const ChoicesCurrency = Choices as IChoicesCurrency;
