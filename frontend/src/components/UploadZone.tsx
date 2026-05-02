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
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', color: '#1e293b' }}>Welcome to DataLens</h2>
                <p style={{ color: '#64748b' }}>Upload your CSV dataset to begin analysis</p>
            </div>
            
            <div 
                style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileUpload')?.click()}
            >
                <input 
                    type="file" 
                    id="fileUpload" 
                    style={{ display: 'none' }} 
                    accept=".csv" 
                    onChange={handleChange}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {loading ? (
                        <p style={{ color: '#475569', fontWeight: 'bold' }}>Uploading dataset...</p>
                    ) : (
                        <div>
                            <p style={{ color: '#334155', fontWeight: 'bold', fontSize: '18px' }}>Click to upload CSV file</p>
                            <p style={{ color: '#94a3b8', fontSize: '14px' }}>or drag and drop here</p>
                        </div>
                    )}
                </div>
            </div>
            {message && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    borderRadius: '8px',
                    backgroundColor: message.includes('Success') ? '#dcfce7' : '#fee2e2',
                    color: message.includes('Success') ? '#166534' : '#991b1b',
                    border: message.includes('Success') ? '1px solid #bbf7d0' : '1px solid #fecaca',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ fontWeight: 'bold' }}>
                        {message.includes('Success') ? '✅ ' : '❌ '} 
                        {message}
                    </span>
                </div>
            )}
        </div>
    );
};
