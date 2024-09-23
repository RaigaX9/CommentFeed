import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentsFeed from './CommentsFeed';

// Mock fetch and WebSocket
let mockWebSocket;
beforeEach(() => {
    mockWebSocket = {
        onmessage: null,
        close: jest.fn(),
        send: jest.fn(),
    };

    global.WebSocket = jest.fn(() => mockWebSocket);
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CommentsFeed Component', () => {
    test('should render the component correctly', () => {
        render(<CommentsFeed />);
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your comment')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Post Comment/i })).toBeInTheDocument();
    });

    test('should display a success alert when a comment is posted', async () => {
        render(<CommentsFeed />);
        fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Your comment'), { target: { value: 'Hello world!' } });

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 1, name: 'John', message: 'Hello world!', created: new Date().toISOString() }),
            })
        );

        fireEvent.click(screen.getByRole('button', { name: /Post Comment/i }));

        await waitFor(() => expect(screen.getByText('Comment posted successfully!')).toBeInTheDocument());
    });

    test('should handle WebSocket messages correctly', async () => {
        render(<CommentsFeed />);

        const newComment = { id: 1, name: 'Emma', message: 'test', created: new Date().toISOString() };

        // Simulate receiving a WebSocket message
        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify(newComment) });
        });

        await waitFor(() => {
            expect(
                screen.getByText((content, node) => {
                    const hasText = (node) =>
                        node.textContent.includes('Emma') && node.textContent.includes('test');
                    const nodeHasText = hasText(node);
                    const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
                    return nodeHasText && childrenDontHaveText;
                })
            ).toBeInTheDocument();
        });
    });

    // Commented this out since the delete button is commented as well. Again for testing purposes.
    // test('should handle deletion of all comments', async () => {
    //     render(<CommentsFeed />);
    //     fireEvent.click(screen.getByRole('button', { name: /Delete All Comments/i }));
    //
    //     expect(screen.getByText(/Are you sure you want to delete all the comments?/i)).toBeInTheDocument();
    //
    //     fireEvent.click(screen.getByText(/Yes/i));
    //     await waitFor(() => expect(screen.getByText(/All comments deleted successfully!/i)).toBeInTheDocument());
    // });

    test('should handle empty WebSocket messages gracefully', async () => {
        render(<CommentsFeed />);

        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify({}) });
        });

        act(() => {
            mockWebSocket.onmessage({ data: JSON.stringify({ id: 2 }) });
        });

        await waitFor(() => {
            expect(screen.queryByText(/: /)).not.toBeInTheDocument();
        });
    });

    test('should handle WebSocket disconnection gracefully', async () => {
        // Mock console.log to spy on calls
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(<CommentsFeed />);

        // Simulate WebSocket disconnection
        act(() => {
            if (mockWebSocket.onclose) {
                mockWebSocket.onclose({ code: 1006, reason: 'Unexpected disconnection' });
            }
        });

        // Check that the WebSocket disconnection was logged to the console
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('WebSocket disconnected');
        });

        // Clean up the spy
        consoleSpy.mockRestore();
    });

    test('should post a comment without WebSocket connection', async () => {
        render(<CommentsFeed />);

        // Simulate WebSocket disconnection before posting
        act(() => {
            if (mockWebSocket.onclose) {
                mockWebSocket.onclose({ code: 1006, reason: 'Unexpected disconnection' });
            }
        });

        // Mock fetch response for posting a comment
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: 2,
                        name: 'Fallback User',
                        message: 'Fallback comment',
                        created: new Date().toISOString(),
                    }),
            })
        );

        // Simulate user input and comment submission
        fireEvent.change(screen.getByPlaceholderText('Your name'), {
            target: { value: 'Fallback User' },
        });
        fireEvent.change(screen.getByPlaceholderText('Your comment'), {
            target: { value: 'Fallback comment' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Post Comment/i }));

        // Ensure comment is posted successfully even without WebSocket
        await waitFor(() => {
            expect(
                screen.getByText((content, node) => {
                    const hasText = node => node.textContent.includes('Fallback comment');
                    const nodeHasText = hasText(node);
                    const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
                    return nodeHasText && childrenDontHaveText;
                })
            ).toBeInTheDocument();
        });

        // Check that fallback toast notification appears
        await waitFor(() => {
            expect(screen.getByText(/New comment by Fallback User/i)).toBeInTheDocument();
        });
    });
});
