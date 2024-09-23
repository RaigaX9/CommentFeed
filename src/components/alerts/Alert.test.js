import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert from './Alert';

describe('Alert Component', () => {
    test('should not render when there is no message', () => {
        render(<Alert message={null} type="success" />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    test('should render the alert with the correct message and type', () => {
        render(<Alert message="This is a success message" type="success" />);
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('This is a success message');
        expect(alertElement).toHaveClass('alert success');
    });

    test('should render an error alert', () => {
        render(<Alert message="This is an error message" type="error" />);
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('This is an error message');
        expect(alertElement).toHaveClass('alert error');
    });

    test('should render an info alert', () => {
        render(<Alert message="This is an info message" type="info" />);
        const alertElement = screen.getByRole('alert');
        expect(alertElement).toBeInTheDocument();
        expect(alertElement).toHaveTextContent('This is an info message');
        expect(alertElement).toHaveClass('alert info');
    });
});
