import { render, screen } from '@testing-library/react';
import ItemRegistration from './ItemRegistration';

test('renders learn react link', () => {
  render(<ItemRegistration />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
