import React from 'react';

interface FilterPanelProps {
    filters: any;
    setFilters: (filters: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (value === 'All') {
            const newFilters = { ...filters };
            delete newFilters[name];
            setFilters(newFilters);
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                🔍 Global Filters
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                    <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>School</label>
                    <select name="school" value={filters.school || 'All'} onChange={handleChange} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem', borderRadius: '0.5rem', width: '100%' }}>
                        <option value="All">All Schools</option>
                        <option value="GP">GP</option>
                        <option value="MS">MS</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                    <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>Sex</label>
                    <select name="sex" value={filters.sex || 'All'} onChange={handleChange} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem', borderRadius: '0.5rem', width: '100%' }}>
                        <option value="All">All Genders</option>
                        <option value="M">Male (M)</option>
                        <option value="F">Female (F)</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                    <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>Internet Access</label>
                    <select name="internet" value={filters.internet || 'All'} onChange={handleChange} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem', borderRadius: '0.5rem', width: '100%' }}>
                        <option value="All">All</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
