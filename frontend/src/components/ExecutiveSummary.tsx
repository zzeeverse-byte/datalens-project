import React, { useState } from 'react';
import { generateSummary } from '../services/api';

interface ExecutiveSummaryProps {
    tableName: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ tableName }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await generateSummary(tableName);
            if (result.status === 'success') {
                setSummary(result.response);
            } else {
                setError(result.message || 'Failed to generate summary');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Executive Summary</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>AI-generated insights and recommendations based on your data</p>
                </div>
                
                {!summary && !loading && (
                    <button 
                        onClick={handleGenerate}
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '2rem', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Generate Insights
                    </button>
                )}
            </div>
            
            {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                    <p style={{ fontWeight: 'bold' }}>Analyzing dataset and generating summary...</p>
                </div>
            )}
            
            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
                    {error}
                </div>
            )}
            
            {summary && (
                <div style={{ backgroundColor: '#e0f2fe', padding: '2rem', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#334155' }}>
                        {summary}
                    </div>
                </div>
            )}
        </div>
    );
};
