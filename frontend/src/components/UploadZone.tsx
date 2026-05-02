import React, { useCallback, useState } from 'react';
import { uploadCSV } from '../services/api';

interface UploadZoneProps {
    onUploadSuccess: (tableName: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    }, []);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setMessage('Please upload a CSV file.');
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const data = await uploadCSV(file);
            if (data.status === 'error') {
                setMessage(`Error: ${data.message}`);
            } else {
                setMessage(`Success! Uploaded ${data.row_count} rows. Table: ${data.table_name}`);
                onUploadSuccess(data.table_name);
            }
        } catch (error: any) {
            setMessage(`Upload failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Welcome to DataLens</h2>
                <p className="text-slate-500 mt-2">Upload your CSV dataset to begin analysis</p>
            </div>
            
            <div 
                className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all duration-200 group bg-white shadow-sm"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileUpload')?.click()}
            >
                <input 
                    type="file" 
                    id="fileUpload" 
                    className="hidden" 
                    accept=".csv" 
                    onChange={handleChange}
                />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-200">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    {loading ? (
                        <p className="text-slate-600 font-medium">Uploading dataset...</p>
                    ) : (
                        <div>
                            <p className="text-slate-700 font-medium text-lg">Click to upload or drag and drop</p>
                            <p className="text-slate-400 text-sm mt-1">CSV files only</p>
                        </div>
                    )}
                </div>
            </div>
            {message && (
                <div className={`mt-6 p-4 rounded-xl flex items-center space-x-3 ${message.includes('Success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.includes('Success') ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-medium">{message}</span>
                </div>
            )}
        </div>
    );
};
