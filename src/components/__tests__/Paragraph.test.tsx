import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paragraph from '../Paragraph';

describe('Paragraph Component', () => {
  const mockProps = {
    id: '1',
    content: '',
    onChange: jest.fn(),
    onDelete: jest.fn(),
  };

  it('renders textarea', () => {
    render(<Paragraph {...mockProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    render(<Paragraph {...mockProps} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    expect(mockProps.onChange).toHaveBeenCalledWith('1', 'Test content');
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<Paragraph {...mockProps} />);
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('displays initial content', () => {
    const propsWithContent = {
      ...mockProps,
      content: 'Initial content',
    };
    render(<Paragraph {...propsWithContent} />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial content');
  });
});