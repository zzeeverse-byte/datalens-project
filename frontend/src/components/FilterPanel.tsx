import React, { useEffect, useState } from 'react';
import { getFilterOptions } from '../services/api';

interface FilterPanelProps {
    tableName: string;
    filters: any;
    setFilters: (filters: any) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ tableName, filters, setFilters }) => {
    const [filterOptions, setFilterOptions] = useState<{ column: string; options: string[] }[]>([]);

    useEffect(() => {
        if (tableName) {
            getFilterOptions(tableName)
                .then((data) => {
                    if (data.status === 'success' && data.filters) {
                        setFilterOptions(data.filters);
                    }
                })
                .catch(console.error);
        }
    }, [tableName]);

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

    if (filterOptions.length === 0) return null;

    return (
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                🔍 Global Filters
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {filterOptions.map((filter) => (
                    <div key={filter.column} style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
                        <label style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>
                            {filter.column}
                        </label>
                        <select
                            name={filter.column}
                            value={filters[filter.column] || 'All'}
                            onChange={handleChange}
                            style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.625rem', borderRadius: '0.5rem', width: '100%' }}
                        >
                            <option value="All">All</option>
                            {filter.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};
