import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal from './DeleteModal';

describe('DeleteModal Component', () => {
    test('renders the modal when open', () => {
        // Render the modal in an open state
        render(<DeleteModal isOpen={true} onClose={jest.fn()} onConfirm={jest.fn()} />);

        // Check that the modal is visible with the correct message
        expect(screen.getByText(/Are you sure you want to delete all the comments?/i)).toBeInTheDocument();

        // Check that the "Yes" and "No" buttons are displayed
        expect(screen.getByText(/Yes/i)).toBeInTheDocument();
        expect(screen.getByText(/No/i)).toBeInTheDocument();
    });

    test('should not render the modal when closed', () => {
        // Render the modal in a closed state
        render(<DeleteModal isOpen={false} onClose={jest.fn()} onConfirm={jest.fn()} />);

        // Check that the modal is not visible
        expect(screen.queryByText(/Are you sure you want to delete all the comments?/i)).not.toBeInTheDocument();
    });

    test('should call onConfirm when "Yes" is clicked', () => {
        // Mock the confirm function
        const onConfirmMock = jest.fn();

        // Render the modal in an open state with the mock function
        render(<DeleteModal isOpen={true} onClose={jest.fn()} onConfirm={onConfirmMock} />);

        // Click the "Yes" button
        fireEvent.click(screen.getByText(/Yes/i));

        // Check that the onConfirm function was called
        expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });

    test('should call onClose when "No" is clicked', () => {
        // Mock the close function
        const onCloseMock = jest.fn();

        // Render the modal in an open state with the mock function
        render(<DeleteModal isOpen={true} onClose={onCloseMock} onConfirm={jest.fn()} />);

        // Click the "No" button
        fireEvent.click(screen.getByText(/No/i));

        // Check that the onClose function was called
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
