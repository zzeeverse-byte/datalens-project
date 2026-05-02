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
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Global Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-semibold text-slate-700">School</label>
                    <select name="school" value={filters.school || 'All'} onChange={handleChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm transition-colors">
                        <option value="All">All Schools</option>
                        <option value="GP">GP</option>
                        <option value="MS">MS</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-semibold text-slate-700">Sex</label>
                    <select name="sex" value={filters.sex || 'All'} onChange={handleChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm transition-colors">
                        <option value="All">All Genders</option>
                        <option value="M">Male (M)</option>
                        <option value="F">Female (F)</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-semibold text-slate-700">Internet Access</label>
                    <select name="internet" value={filters.internet || 'All'} onChange={handleChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm transition-colors">
                        <option value="All">All</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
