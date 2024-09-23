import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentForm from './CommentForm';

describe('CommentForm Component', () => {
    test('should render input fields correctly', () => {
        render(<CommentForm onSubmit={jest.fn()} name="" setName={jest.fn()} message="" setMessage={jest.fn()} />);
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your comment')).toBeInTheDocument();
    });

    test('should call onSubmit when the form is submitted', () => {
        const onSubmitMock = jest.fn();
        render(<CommentForm onSubmit={onSubmitMock} name="John" setName={jest.fn()} message="Hello" setMessage={jest.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: /Post Comment/i }));
        expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
});
