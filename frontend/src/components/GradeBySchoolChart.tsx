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
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-base font-bold text-slate-700 mb-6">Avg Grade by School</h3>
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
