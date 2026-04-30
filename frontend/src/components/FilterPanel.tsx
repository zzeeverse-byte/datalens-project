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
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto flex gap-6 items-center justify-center">
            <div>
                <label className="mr-2 font-semibold text-gray-700">School:</label>
                <select name="school" value={filters.school || 'All'} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300">
                    <option value="All">All</option>
                    <option value="GP">GP</option>
                    <option value="MS">MS</option>
                </select>
            </div>
            <div>
                <label className="mr-2 font-semibold text-gray-700">Sex:</label>
                <select name="sex" value={filters.sex || 'All'} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300">
                    <option value="All">All</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                </select>
            </div>
            <div>
                <label className="mr-2 font-semibold text-gray-700">Internet:</label>
                <select name="internet" value={filters.internet || 'All'} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring focus:border-blue-300">
                    <option value="All">All</option>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                </select>
            </div>
        </div>
    );
};
