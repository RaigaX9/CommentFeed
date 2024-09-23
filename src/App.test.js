import { render, screen } from '@testing-library/react';
import App from './App';

test('should render the Comment Section heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Comment Feed/i);
  expect(headingElement).toBeInTheDocument();
});
