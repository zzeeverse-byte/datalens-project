import React, { useState, useEffect } from 'react';
import { GradeBySchoolChart } from './GradeBySchoolChart';
import { StudytimeChart } from './StudytimeChart';
import { InternetChart } from './InternetChart';
import { AbsencesChart } from './AbsencesChart';
import { ParentEducationChart } from './ParentEducationChart';
import { getChartData, getGenericCharts } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
    const [isGeneric, setIsGeneric] = useState(false);
    const [genericCharts, setGenericCharts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getChartData('grade-by-school', tableName, {})
            .then(res => {
                if (res.status === 'error' || !res.data || res.data.length === 0) {
                    return getGenericCharts(tableName).then(genRes => {
                        if (genRes.status === 'success') {
                            setGenericCharts(genRes.charts || []);
                            setIsGeneric(true);
                        }
                    }).catch(() => setIsGeneric(false));
                } else {
                    setIsGeneric(false);
                }
            })
            .catch(() => {
                getGenericCharts(tableName).then(genRes => {
                    if (genRes.status === 'success') {
                        setGenericCharts(genRes.charts || []);
                        setIsGeneric(true);
                    }
                }).catch(() => setIsGeneric(false));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tableName]);

    if (loading) {
        return <div style={{ paddingTop: '1rem', color: '#64748b' }}>Loading dashboard...</div>;
    }

    if (isGeneric) {
        return (
            <div style={{ paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>📈 Interactive Dashboard (Auto-Generated)</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    {genericCharts.map((chart, idx) => (
                        <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', height: '300px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#334155', marginBottom: '1.5rem', textAlign: 'center' }}>{chart.title}</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chart.data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={chart.dataKeyX} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey={chart.dataKeyY} fill="#8884d8" name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>📈 Interactive Dashboard</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <GradeBySchoolChart tableName={tableName} filters={filters} />
                <StudytimeChart tableName={tableName} filters={filters} />
                <InternetChart tableName={tableName} filters={filters} />
                <AbsencesChart tableName={tableName} filters={filters} />
                <div style={{ gridColumn: '1 / -1' }}>
                    <ParentEducationChart tableName={tableName} filters={filters} />
                </div>
            </div>
        </div>
    );
};
