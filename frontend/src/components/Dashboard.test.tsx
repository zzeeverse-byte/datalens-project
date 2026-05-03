import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
    it('renders without crashing', () => {
        const { container } = render(<Dashboard tableName="student_mat" filters={{}} />);
        expect(container).not.toBeEmptyDOMElement();
        expect(screen.getByText(/Interactive Dashboard/i)).toBeInTheDocument();
    });
});
