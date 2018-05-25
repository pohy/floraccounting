import { FocusEvent } from 'react';

export function selectInputText(event: FocusEvent<HTMLInputElement>) {
    event.currentTarget.select();
}
