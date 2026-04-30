import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartData } from '../services/api';

export const AbsencesChart: React.FC<{ tableName: string }> = ({ tableName }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getChartData('absences-vs-grade', tableName).then(res => {
            if (res.status === 'success') setData(res.data);
        });
    }, [tableName]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Absences vs Grade</h3>
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
