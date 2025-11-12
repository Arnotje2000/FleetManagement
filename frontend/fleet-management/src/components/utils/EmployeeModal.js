import React from 'react';

const EmployeeModal = ({ isOpen, onClose, onAddEmployee, newEmployeeEmail, setNewEmployeeEmail, newEmployeeRole, setNewEmployeeRole }) => {
    if (!isOpen) return null; // Don't render if the modal is not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add New Employee</h2>
                <input
                    type="email"
                    placeholder="Enter Email Address"
                    value={newEmployeeEmail}
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                />
                <select
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-4"
                >
                    <option value="3">Employee</option>
                    <option value="2">Admin</option>
                </select>
                <div className="flex justify-end">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onAddEmployee}
                    >
                        Add
                    </button>
                    <button 
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;