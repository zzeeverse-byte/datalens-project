import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UploadZone } from './UploadZone';

describe('UploadZone', () => {
    it('renders the upload zone correctly', () => {
        render(<UploadZone onUploadSuccess={vi.fn()} />);
        const elements = screen.getAllByText(/drag|upload/i);
        expect(elements.length).toBeGreaterThan(0);
    });
});
