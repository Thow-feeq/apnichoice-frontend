// client/src/components/Welcome.test.jsx
import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';

test('renders welcome message', () => {
  render(<Welcome name="Thowfeeq" />);
  const heading = screen.getByText(/welcome, thowfeeq/i);
  expect(heading).toBeInTheDocument();
});
