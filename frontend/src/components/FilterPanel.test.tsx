import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
    it('renders the three dropdowns', () => {
        render(<FilterPanel filters={{}} setFilters={vi.fn()} />);
        expect(screen.getAllByText(/School/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Sex/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Internet/i)[0]).toBeInTheDocument();
    });
});
