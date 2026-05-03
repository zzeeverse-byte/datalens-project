import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { ChatPanel } from './ChatPanel';

describe('ChatPanel', () => {
    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = function() {};
    });

    it('renders input box and send button', () => {
        render(<ChatPanel tableName="student_mat" />);
        expect(screen.getByPlaceholderText(/Type your question/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
    });
});
