import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../utils/Card';
import Sidebar from '../utils/Sidebar';
import EditCustomFieldModal from '../utils/EditCustomFieldModal';

const CustomFieldManagement = () => {
  const { user } = useContext(AuthContext);
  const tenantId = user?.tenantId;
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [error, setError] = useState('');
  const [selectedValueType, setSelectedValueType] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomField, setSelectedCustomField] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const fetchCustomFields = async () => {
    if (!tenantId) return;

    try {
      const response = await axios.get(`http://localhost:5054/api/tenant/${tenantId}`);
      const customFieldsData = response.data.customFields?.$values || [];
      console.log('Custom fields data:', customFieldsData);
      
      // Ensure proper casing and filter out invalid custom fields
      const validCustomFields = customFieldsData
        .filter(field => !field.IsDeleted)
        .map(field => ({
          CustomFieldId: field.customFieldId || field.CustomFieldId,
          FieldName: field.fieldName || field.FieldName,
          ValueType: field.valueType || field.ValueType,
          IsDeleted: field.isDeleted || field.IsDeleted
        }));
      
      console.log('Final mapped custom fields:', validCustomFields);
      setCustomFields(validCustomFields);
      setError('');
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      setError('Failed to load custom fields. Please try again later.');
      setCustomFields([]);
    }
  };

  const getValueTypeIdFromString = (valueType) => {
    switch (valueType?.toLowerCase()) {
      case "string": return 1;
      case "int": return 2;
      case "datetime": return 3;
      case "boolean": return 4;
      default: return 1;
    }
  };

  useEffect(() => {
    fetchCustomFields();
  }, [tenantId]);

  const getValueTypeString = (valueTypeId) => {
    switch (valueTypeId) {
      case 1: return "String";
      case 2: return "Int";
      case 3: return "DateTime";
      case 4: return "Boolean";
      default: return "String";
    }
  };

  const getValueTypeDisplay = (valueType) => {
    switch (valueType) {
      case 1: return "Text";
      case 2: return "Number";
      case 3: return "Date";
      case 4: return "Boolean";
      default: return "Text";
    }
  };

  const handleAddCustomField = async () => {
    if (!customFieldName.trim()) {
      setError('Please enter a field name');
      return;
    }

    try {
      const newCustomField = {
        TenantId: parseInt(tenantId),
        ValueType: getValueTypeString(selectedValueType),
        FieldName: customFieldName.trim(),
        IsDeleted: false,
        CustomFieldValues: [],
        Tenant: {
          TenantId: parseInt(tenantId),
          CompanyName: "",  
          VATNumber: "",
          IsDeleted: false,
          Users: [],
          Vehicles: [],
          CustomFields: []
        }
      };

      console.log('Sending custom field data:', newCustomField);

      const response = await axios.post(
        `http://localhost:5054/api/tenant/${tenantId}/customfields`,
        newCustomField
      );

      if (response.status === 200 || response.status === 201) {
        await fetchCustomFields(); 
        setCustomFieldName(''); 
        setError('');
      }
    } catch (error) {
      console.error('Error adding custom field:', error);
      if (error.response) {
        console.error('Error details:', error.response.data);
        setError(`Failed to add custom field: ${error.response.data}`);
      } else {
        setError('Failed to add custom field. Please try again.');
      }
    }
  };

  const handleUpdateCustomField = async (updatedCustomField) => {
    try {
      const completeCustomField = {
        CustomFieldId: updatedCustomField.CustomFieldId,
        TenantId: parseInt(tenantId),
        FieldName: updatedCustomField.FieldName,
        ValueType: updatedCustomField.ValueType,
        IsDeleted: false,
        CustomFieldValues: [],
        Tenant: {
          TenantId: parseInt(tenantId),
          CompanyName: "",
          VATNumber: "",
          IsDeleted: false,
          Users: [],
          Vehicles: [],
          CustomFields: []
        }
      };

      const response = await axios.put(
        `http://localhost:5054/api/tenant/${tenantId}/customfields/${updatedCustomField.CustomFieldId}`,
        completeCustomField
      );

      if (response.status === 200) {
        await fetchCustomFields(); // Refresh the list
        setError('');
      }
    } catch (error) {
      console.error('Error updating custom field:', error);
      setError('Failed to update custom field. Please try again.');
    }
  };

  const handleDeleteCustomField = async (customFieldId) => {
    if (window.confirm('Are you sure you want to delete this custom field? This will also delete all values associated with it.')) {
      try {
        await axios.delete(`http://localhost:5054/api/tenant/${tenantId}/customfields/${customFieldId}`);
        await fetchCustomFields(); // Refresh the list
        setError('');
      } catch (error) {
        console.error('Error deleting custom field:', error);
        setError('Failed to delete custom field. Please try again.');
      }
    }
  };

  const handleValueTypeChange = (e) => {
    const newValue = parseInt(e.target.value);
    setSelectedValueType(newValue);
    setShowWarning(newValue === 2);
  };

  let inputField;
  switch (selectedValueType) {
    case 1: // Text
      inputField = <input type="text" className="border border-gray-300 rounded p-2" />;
      break;
    case 2: // Number
      inputField = <input type="number" className="border border-gray-300 rounded p-2" />;
      break;
    case 3: // Boolean
      inputField = <input type="checkbox" className="border border-gray-300 rounded p-2" />;
      break;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="bedrijfsAdmin" />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Custom Field Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Card for Adding Custom Field */}
        <Card title="Add Custom Field" className="mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Custom Field Name"
                value={customFieldName}
                onChange={(e) => setCustomFieldName(e.target.value)}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <select
                value={selectedValueType}
                onChange={handleValueTypeChange}
                className="border border-gray-300 rounded p-2"
              >
                <option value={1}>Text</option>
                <option value={2}>Number</option>
                <option value={4}>Boolean</option>
              </select>
              <button
                onClick={handleAddCustomField}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Custom Field
              </button>
            </div>
            {showWarning && (
              <div className="text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                <i className="fi fi-rr-exclamation-triangle mr-2"></i>
                Warning: Number type will only allow numeric values.
              </div>
            )}
          </div>
        </Card>

        {/* Card for Displaying Custom Fields */}
        <Card title="Custom Fields">
          <div className="overflow-x-auto">
            {customFields.length === 0 ? (
              <p className="text-gray-500 p-4">No custom fields added yet.</p>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center">Actions</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Field Name</th>
                    <th className="px-4 py-2 text-left">Value Type</th>
                  </tr>
                </thead>
                <tbody>
                  {customFields.length > 0 ? (
                    customFields.map((field, index) => (
                      <tr key={field.CustomFieldId || `field-${index}`} className="border-b border-gray-300 border-opacity-50">
                        <td className="px-4 py-2 text-center">
                          <button
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            onClick={() => {
                              setSelectedCustomField(field);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <i className="fi fi-rr-pencil"></i>
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteCustomField(field.CustomFieldId)}
                          >
                            <i className="fi fi-rr-trash"></i>
                          </button>
                        </td>
                        <td className="px-4 py-2">{field.CustomFieldId || 'N/A'}</td>
                        <td className="px-4 py-2">{field.FieldName || 'N/A'}</td>
                        <td className="px-4 py-2">{field.ValueType || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-2 text-center text-gray-500">No custom fields available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Custom Field Modal */}
      <EditCustomFieldModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomField(null);
        }}
        customField={selectedCustomField}
        onUpdateCustomField={handleUpdateCustomField}
      />
    </div>
  );
};

export default CustomFieldManagement;