import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dashboard } from './Dashboard';

vi.mock('../services/api', () => ({
    getChartData: vi.fn(() => Promise.resolve({ status: 'success', data: [{}] })),
    getGenericCharts: vi.fn(() => Promise.resolve({ status: 'success', charts: [] })),
}));

describe('Dashboard', () => {
    it('renders without crashing', async () => {
        const { container } = render(<Dashboard tableName="student_mat" filters={{}} />);
        expect(container).not.toBeEmptyDOMElement();
        expect(await screen.findByText(/Interactive Dashboard/i)).toBeInTheDocument();
    });
});
