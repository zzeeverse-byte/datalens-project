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
        <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow-md max-w-5xl mx-auto border border-blue-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Executive Summary</h2>
                {!summary && !loading && (
                    <button 
                        onClick={handleGenerate}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Generate Executive Summary
                    </button>
                )}
            </div>
            
            {loading && (
                <div className="flex items-center gap-3 text-gray-600 mt-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Analyzing dataset and generating summary...</span>
                </div>
            )}
            
            {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded mt-4 border border-red-200">
                    {error}
                </div>
            )}
            
            {summary && (
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-6 rounded border border-gray-100 shadow-inner">
                    {summary}
                </div>
            )}
        </div>
    );
};
