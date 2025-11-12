import React, { useState, useEffect } from 'react';

const EditCustomFieldModal = ({ isOpen, onClose, customField, onUpdateCustomField }) => {
    const [fieldName, setFieldName] = useState('');
    const [valueType, setValueType] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (isOpen && customField) {
            setFieldName(customField.FieldName || '');
            setValueType(customField.ValueType || '');
            setShowWarning(customField.ValueType === 'Int');
        }
    }, [isOpen, customField]);

    const handleValueTypeChange = (e) => {
        const newValueType = e.target.value;
        setValueType(newValueType);
        setShowWarning(newValueType === 'Int');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const updatedCustomField = {
                ...customField,
                FieldName: fieldName,
                ValueType: valueType
            };

            await onUpdateCustomField(updatedCustomField);
            onClose();
        } catch (error) {
            console.error('Error updating custom field:', error);
            alert('Failed to update custom field. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-bold mb-4">Edit Custom Field</h2>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Field Name</label>
                    <input
                        type="text"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Value Type</label>
                    <select
                        value={valueType}
                        onChange={handleValueTypeChange}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="String">Text</option>
                        <option value="Int">Number</option>
                        <option value="DateTime">Date</option>
                        <option value="Boolean">Boolean</option>
                    </select>
                    {showWarning && (
                        <div className="mt-2 text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                            <i className="fi fi-rr-exclamation-triangle mr-2"></i>
                            Warning: Changing to Number type will only allow numeric values. All non-numeric values will be cleared.
                        </div>
                    )}
                </div>
                
                <div className="flex justify-end mt-4">
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                    <button 
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCustomFieldModal; 