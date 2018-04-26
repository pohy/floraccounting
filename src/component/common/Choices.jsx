import React from 'react';
import './Choices.css';

export const Choices = ({ choices, isSelected, onChoice }) => (
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

function selectChoice(select, choice) {
    return () => select(choice);
}
