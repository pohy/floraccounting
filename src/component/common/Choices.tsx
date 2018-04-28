import React, { SFC } from 'react';
import './Choices.css';

export type IsSelectedHandler = (choice: string) => boolean;
export type OnChoiceHandler = (choice: string) => void;

export interface IChoicesProps {
    choices: string[];
    isSelected: IsSelectedHandler;
    onChoice: OnChoiceHandler;
}

export const Choices: SFC<IChoicesProps> = ({
    choices,
    isSelected,
    onChoice,
}) => (
    <div className="Choices">
        {choices.map((choice, key) => (
            <span
                className={`choice${isSelected(choice) ? ' selected' : ''}`}
                onClick={selectChoice(onChoice, choice)}
                {...{ key }}
            >
                {choice}
            </span>
        ))}
    </div>
);

function selectChoice(onChoice: OnChoiceHandler, choice: string) {
    return () => onChoice(choice);
}
