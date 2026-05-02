import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/api';

interface ProfilePanelProps {
    tableName: string;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = ({ tableName }) => {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const result = await getProfile(tableName);
                if (result.status === 'error') {
                    setError(result.message || 'Failed to fetch profile data');
                } else {
                    setProfileData(result);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tableName) {
            fetchProfile();
        }
    }, [tableName]);

    if (loading) return <div className="mt-8 text-center text-gray-600">Loading profile data...</div>;
    if (error) return <div className="mt-8 text-center text-red-500">Error: {error}</div>;
    if (!profileData) return null;

    return (
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Data Profile: <span className="font-mono text-blue-600 ml-2">{tableName}</span>
                </h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Column</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {Object.entries(profileData).map(([colName, info]: [string, any]) => (
                            <tr key={colName} className="hover:bg-slate-50/50 transition-colors even:bg-slate-50/30">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{colName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        info.type === 'numeric' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                        info.type === 'boolean' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                        'bg-purple-100 text-purple-700 border border-purple-200'
                                    }`}>
                                        {info.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {info.type === 'numeric' && (
                                        <div className="flex gap-6">
                                            <span className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Min</span> <span>{info.min?.toFixed(2) ?? info.min}</span></span>
                                            <span className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max</span> <span>{info.max?.toFixed(2) ?? info.max}</span></span>
                                            <span className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Mean</span> <span>{info.mean?.toFixed(2)}</span></span>
                                            <span className="flex flex-col"><span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Median</span> <span>{info.median?.toFixed(2)}</span></span>
                                        </div>
                                    )}
                                    {(info.type === 'categorical' || info.type === 'boolean') && info.counts && (
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(info.counts).map(([val, count]) => (
                                                <span key={val} className="bg-white px-2.5 py-1 rounded-md text-xs border border-slate-200 shadow-sm flex items-center gap-2">
                                                    <span className="font-medium text-slate-700">{val === '' || val === 'null' ? 'Empty' : val}</span>
                                                    <span className="text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{String(count)}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
