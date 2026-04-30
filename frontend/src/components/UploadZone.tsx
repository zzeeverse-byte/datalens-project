import React, { useCallback, useState } from 'react';
import { uploadCSV } from '../services/api';

export const UploadZone: React.FC = () => {
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
            }
        } catch (error: any) {
            setMessage(`Upload failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Dataset</h2>
            <div 
                className="border-2 border-dashed border-blue-400 rounded-lg p-10 text-center cursor-pointer hover:bg-blue-50 transition-colors"
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
                {loading ? (
                    <p className="text-gray-600">Uploading...</p>
                ) : (
                    <p className="text-gray-600">Drag and drop a CSV file here, or click to select</p>
                )}
            </div>
            {message && (
                <div className={`mt-4 p-3 rounded ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};
