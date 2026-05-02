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
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                    📊 Data Profile: <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{tableName}</span>
                </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Column</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Type</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(profileData).map(([colName, info]: [string, any], index: number) => (
                            <tr key={colName} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>{colName}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: info.type === 'numeric' ? '#2563eb' : info.type === 'boolean' ? '#16a34a' : '#ea580c'
                                    }}>
                                        {info.type}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#475569' }}>
                                    {info.type === 'numeric' && (
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Min</span> <span>{info.min?.toFixed(2) ?? info.min}</span></span>
                                            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Max</span> <span>{info.max?.toFixed(2) ?? info.max}</span></span>
                                            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Mean</span> <span>{info.mean?.toFixed(2)}</span></span>
                                            <span style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Median</span> <span>{info.median?.toFixed(2)}</span></span>
                                        </div>
                                    )}
                                    {(info.type === 'categorical' || info.type === 'boolean') && info.counts && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {Object.entries(info.counts).map(([val, count]) => (
                                                <span key={val} style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#334155' }}>{val === '' || val === 'null' ? 'Empty' : val}</span>
                                                    <span style={{ color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>{String(count)}</span>
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
