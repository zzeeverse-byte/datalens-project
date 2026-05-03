import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterPanel } from './FilterPanel';
import { getFilterOptions } from '../services/api';

vi.mock('../services/api', () => ({
    getFilterOptions: vi.fn(),
}));

describe('FilterPanel', () => {
    it('renders dynamic dropdowns', async () => {
        (getFilterOptions as any).mockResolvedValue({
            status: 'success',
            filters: [
                { column: 'school', options: ['GP', 'MS'] },
                { column: 'sex', options: ['F', 'M'] }
            ]
        });

        render(<FilterPanel tableName="test_table" filters={{}} setFilters={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('school')).toBeInTheDocument();
            expect(screen.getByText('sex')).toBeInTheDocument();
        });
    });
});
