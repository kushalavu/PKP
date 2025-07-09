import React from 'react';
import TestingUnitsForm from '@/components/TestingUnitsForm/TestingUnitsForm';
import TestingUnitsTable from '@/components/TestingUnitsForm/TestingUnitsTable';

const Page = () => {
    return (
        <div className="container-fluid">
            <div className="row form-complete-bg p-2">
                <div className="col-sm-12 mt-3">
                    <TestingUnitsForm />
                </div>
                <div className="col-sm-12 mt-5">
                    <TestingUnitsTable />
                </div>
            </div>
        </div>
    );
};
export default Page;