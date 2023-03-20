import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from '../button';

describe('Button component', () => {
  it('renders the button with the given label', () => {
    render(<Button label="Test Button" onClick={() => {}} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders the button with the correct styles when disabled', () => {
    render(<Button label="Test Button" onClick={() => {}} disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
    expect(button).toHaveAttribute('disabled');
  });

  it('invokes the onClick callback when clicked', () => {
    const onClick = jest.fn();
    render(<Button label="Test Button" onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not invoke the onClick callback when disabled and clicked', () => {
    const onClick = jest.fn();
    render(<Button label="Test Button" onClick={onClick} disabled />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
