import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExecutiveSummary } from './ExecutiveSummary';

describe('ExecutiveSummary', () => {
    it('renders the generate button', () => {
        render(<ExecutiveSummary tableName="student_mat" />);
        expect(screen.getByRole('button', { name: /Generate/i })).toBeInTheDocument();
    });
});
