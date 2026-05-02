import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getChartData } from '../services/api';

export const GradeBySchoolChart: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getChartData('grade-by-school', tableName, filters).then(res => {
            if (res.status === 'success') setData(res.data);
        });
    }, [tableName, filters]);

    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', height: '300px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '1.5rem', textAlign: 'center' }}>Avg Grade by School</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="school" />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg_G3" fill="#8884d8" name="Avg Grade (G3)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
