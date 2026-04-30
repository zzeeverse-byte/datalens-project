import React from 'react';
import { GradeBySchoolChart } from './GradeBySchoolChart';
import { StudytimeChart } from './StudytimeChart';
import { InternetChart } from './InternetChart';
import { AbsencesChart } from './AbsencesChart';
import { ParentEducationChart } from './ParentEducationChart';

export const Dashboard: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
    return (
        <div className="mt-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Data Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GradeBySchoolChart tableName={tableName} filters={filters} />
                <StudytimeChart tableName={tableName} filters={filters} />
                <InternetChart tableName={tableName} filters={filters} />
                <AbsencesChart tableName={tableName} filters={filters} />
                <div className="md:col-span-2">
                    <ParentEducationChart tableName={tableName} filters={filters} />
                </div>
            </div>
        </div>
    );
};
