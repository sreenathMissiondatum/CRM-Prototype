import React from 'react';

const RoleBuilderDemo = ({ onExit }) => {
    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Role Builder Demo (Safe Mode)</h1>
            <button
                onClick={onExit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Exit Demo
            </button>
        </div>
    );
};

export default RoleBuilderDemo;
