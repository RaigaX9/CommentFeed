import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentList from './CommentList';

describe('CommentList Component', () => {
    test('should render comments correctly', () => {
        const comments = [
            { id: 1, name: 'John', message: 'Hello World', created: new Date().toISOString() },
            { id: 2, name: 'Emma', message: 'test', created: new Date().toISOString() },
        ];

        render(<CommentList comments={comments} />);

        const testText1 = (content, node) => {
            const hasText = node => node.textContent.includes('John') && node.textContent.includes('Hello World');
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
            return nodeHasText && childrenDontHaveText;
        };

        expect(screen.getByText(testText1)).toBeInTheDocument();

        const testText2 = (content, node) => {
            const hasText = node => node.textContent.includes('Emma') && node.textContent.includes('test');
            const nodeHasText = hasText(node);
            const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
            return nodeHasText && childrenDontHaveText;
        };

        expect(screen.getByText(testText2)).toBeInTheDocument();
    });
});
