import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteCommentsButton from './DeleteCommentsButton';

describe('DeleteCommentsButton Component', () => {
    test('should render delete button correctly', () => {
        render(<DeleteCommentsButton onClick={jest.fn()} />);
        expect(screen.getByRole('button', { name: /Delete All Comments/i })).toBeInTheDocument();
    });

    test('should call onClick when button is clicked', () => {
        const onClickMock = jest.fn();
        render(<DeleteCommentsButton onClick={onClickMock} />);
        fireEvent.click(screen.getByRole('button', { name: /Delete All Comments/i }));
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});
