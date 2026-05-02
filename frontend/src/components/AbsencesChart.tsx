import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartData } from '../services/api';

export const AbsencesChart: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getChartData('absences-vs-grade', tableName, filters).then(res => {
            if (res.status === 'success') setData(res.data);
        });
    }, [tableName, filters]);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-base font-bold text-slate-700 mb-6">Absences vs Grade</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="absences" name="Absences" />
                    <YAxis type="number" dataKey="G3" name="Grade (G3)" domain={[0, 20]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Students" data={data} fill="#ff7300" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};
