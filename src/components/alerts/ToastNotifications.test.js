import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastNotifications from './ToastNotifications';
import { showToast } from './ToastNotifications';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
    ToastContainer: () => <div>Mock Toast Container</div>,
}));

describe('ToastNotifications Component', () => {
    test('should render ToastContainer', () => {
        render(<ToastNotifications />);
        expect(screen.getByText('Mock Toast Container')).toBeInTheDocument();
    });

    test('should display success toast message', () => {
        showToast('Success message', 'success');
        expect(toast.success).toHaveBeenCalledWith('Success message');
    });

    test('should display error toast message', () => {
        showToast('Error message', 'error');
        expect(toast.error).toHaveBeenCalledWith('Error message');
    });

    test('should display info toast message', () => {
        showToast('Info message', 'info');
        expect(toast.info).toHaveBeenCalledWith('Info message');
    });
});
