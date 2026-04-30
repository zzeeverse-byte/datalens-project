import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
    it('renders the three dropdowns', () => {
        render(<FilterPanel filters={{}} setFilters={vi.fn()} />);
        expect(screen.getByText(/School:/i)).toBeInTheDocument();
        expect(screen.getByText(/Sex:/i)).toBeInTheDocument();
        expect(screen.getByText(/Internet:/i)).toBeInTheDocument();
    });
});
