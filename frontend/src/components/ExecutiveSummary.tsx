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
        <div className="bg-sky-50 p-8 rounded-2xl shadow-sm border border-sky-100 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Executive Summary</h2>
                        <p className="text-slate-500 text-sm mt-1">AI-generated insights and recommendations based on your data</p>
                    </div>
                </div>
                
                {!summary && !loading && (
                    <button 
                        onClick={handleGenerate}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 hover:shadow-md transition-all font-medium flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate Insights
                    </button>
                )}
            </div>
            
            {loading && (
                <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-sky-100/50 shadow-sm">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-blue-600 mb-4"></div>
                        <span className="text-slate-600 font-medium animate-pulse">Analyzing dataset and generating summary...</span>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 flex items-center shadow-sm">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}
            
            {summary && (
                <div className="prose prose-slate max-w-none bg-white p-8 rounded-xl border border-sky-100 shadow-sm">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                        {summary}
                    </div>
                </div>
            )}
        </div>
    );
};
