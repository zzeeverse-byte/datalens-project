import React from 'react';
import { GradeBySchoolChart } from './GradeBySchoolChart';
import { StudytimeChart } from './StudytimeChart';
import { InternetChart } from './InternetChart';
import { AbsencesChart } from './AbsencesChart';
import { ParentEducationChart } from './ParentEducationChart';

export const Dashboard: React.FC<{ tableName: string, filters?: any }> = ({ tableName, filters = {} }) => {
    return (
        <div className="pt-4">
            <div className="flex items-center mb-8 pb-4 border-b border-slate-200">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Interactive Dashboard</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GradeBySchoolChart tableName={tableName} filters={filters} />
                <StudytimeChart tableName={tableName} filters={filters} />
                <InternetChart tableName={tableName} filters={filters} />
                <AbsencesChart tableName={tableName} filters={filters} />
                <div className="lg:col-span-2">
                    <ParentEducationChart tableName={tableName} filters={filters} />
                </div>
            </div>
        </div>
    );
};
