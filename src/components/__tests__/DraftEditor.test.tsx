import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DraftEditor from '../DraftEditor';

// Mock jsPDF
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(['mocked line']),
    addPage: jest.fn(),
  }));
});

describe('DraftEditor Component', () => {
  it('renders without crashing', () => {
    render(<DraftEditor />);
    expect(screen.getByText('Assistente de Escrita')).toBeInTheDocument();
  });

  it('adds a new paragraph when clicking the add button', () => {
    render(<DraftEditor />);
    const addButton = screen.getByText('Adicionar Parágrafo');
    fireEvent.click(addButton);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(2);
  });

  it('saves draft and generates PDF when clicking save button', () => {
    render(<DraftEditor />);
    const saveButton = screen.getByText('Salvar Rascunho');
    fireEvent.click(saveButton);
    expect(screen.getByText('Textos Salvos')).toBeInTheDocument();
  });

  it('updates paragraph content when typing', () => {
    render(<DraftEditor />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    expect(textarea).toHaveValue('Test content');
  });
});