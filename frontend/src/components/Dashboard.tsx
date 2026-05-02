import React from 'react';
import { GradeBySchoolChart } from './GradeBySchoolChart';
import { StudytimeChart } from './StudytimeChart';
import { InternetChart } from './InternetChart';
import { AbsencesChart } from './AbsencesChart';
import { ParentEducationChart } from './ParentEducationChart';

export const Dashboard: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
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
