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
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Data Profile: {tableName}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(profileData).map(([colName, info]: [string, any]) => (
                            <tr key={colName}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{colName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        info.type === 'numeric' ? 'bg-blue-100 text-blue-800' :
                                        info.type === 'boolean' ? 'bg-green-100 text-green-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {info.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {info.type === 'numeric' && (
                                        <div className="flex gap-4">
                                            <span><strong>Min:</strong> {info.min?.toFixed(2) ?? info.min}</span>
                                            <span><strong>Max:</strong> {info.max?.toFixed(2) ?? info.max}</span>
                                            <span><strong>Mean:</strong> {info.mean?.toFixed(2)}</span>
                                            <span><strong>Median:</strong> {info.median?.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {(info.type === 'categorical' || info.type === 'boolean') && info.counts && (
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(info.counts).map(([val, count]) => (
                                                <span key={val} className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                                                    <strong>{val === '' || val === 'null' ? 'Empty' : val}:</strong> {String(count)}
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
