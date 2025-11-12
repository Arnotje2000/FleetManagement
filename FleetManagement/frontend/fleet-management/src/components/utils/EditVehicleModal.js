import React, { useState, useEffect } from 'react';

const EditVehicleModal = ({ isOpen, onClose, vehicle, onUpdateVehicle, onUpdateCustomField, customFields = [], vehicleTypes = [], fuelTypes = [], tenantId }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [chassisNumber, setChassisNumber] = useState('');
    const [color, setColor] = useState('');
    const [vehicleTypeId, setVehicleTypeId] = useState('');
    const [fuelTypeId, setFuelTypeId] = useState('');
    const [customFieldValues, setCustomFieldValues] = useState({});

    useEffect(() => {
        if (isOpen && vehicle) {
            // Initialize all field values based on the selected vehicle
            const initialCustomFieldValues = {};
            if (Array.isArray(customFields)) {
                customFields.forEach(field => {
                    const vehicleField = vehicle.CustomFieldValues?.find(
                        cfv => cfv.CustomFieldId === field.CustomFieldId
                    );
                    const fieldValue = vehicleField ? vehicleField.Value : '';

                    if (field.ValueType.toLowerCase() === 'boolean') {
                        // For boolean fields, convert the string value to a boolean
                        initialCustomFieldValues[field.FieldName] = fieldValue.toLowerCase() === 'true';
                    } else {
                        // For other types, use the value as is
                        initialCustomFieldValues[field.FieldName] = fieldValue;
                    }
                });
            }
            setCustomFieldValues(initialCustomFieldValues);
            setBrand(vehicle.Brand || '');
            setModel(vehicle.Model || '');
            setLicensePlate(vehicle.LicensePlate || '');
            setChassisNumber(vehicle.ChassisNumber || '');
            setColor(vehicle.Color || '');
            setVehicleTypeId(vehicle.VehicleType?.VehicleTypeId || vehicle.VehicleTypeId || '');
            setFuelTypeId(vehicle.Fuel?.FuelTypeId || vehicle.FuelTypeId || '');
        }
    }, [isOpen, vehicle, customFields]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create a complete vehicle object with all required fields
        const updatedVehicle = {
            VehicleId: vehicle.VehicleId,
            Brand: brand,
            Model: model,
            LicensePlate: licensePlate,
            ChassisNumber: chassisNumber,
            Color: color,
            FuelTypeId: parseInt(fuelTypeId),
            VehicleTypeId: parseInt(vehicleTypeId),
            TenantId: tenantId,
            IsDeleted: false,
            CustomFieldValues: customFields.map(field => {
                const existingValue = vehicle.CustomFieldValues?.find(cfv => 
                    cfv.CustomFieldId === field.CustomFieldId
                );
                
                const value = customFieldValues[field.FieldName]?.toString() || "";
                
                return {
                    CustomFieldValueId: existingValue?.CustomFieldValueId || 0,
                    VehicleId: vehicle.VehicleId,
                    CustomFieldId: field.CustomFieldId,
                    Value: value,
                    ValueType: field.ValueType,
                    IsDeleted: false,
                    CustomField: {
                        CustomFieldId: field.CustomFieldId,
                        FieldName: field.FieldName,
                        ValueType: field.ValueType,
                        TenantId: tenantId,
                        IsDeleted: false,
                        Tenant: {
                            TenantId: tenantId,
                            CompanyName: vehicle.Tenant?.CompanyName || "",
                            VATNumber: vehicle.Tenant?.VATNumber || "",
                            IsDeleted: false,
                            Users: [],
                            Vehicles: [],
                            CustomFields: []
                        }
                    },
                    Vehicle: {
                        VehicleId: vehicle.VehicleId,
                        TenantId: tenantId,
                        Brand: brand,
                        Model: model,
                        LicensePlate: licensePlate,
                        ChassisNumber: chassisNumber,
                        Color: color,
                        FuelTypeId: parseInt(fuelTypeId),
                        VehicleTypeId: parseInt(vehicleTypeId),
                        IsDeleted: false,
                        Fuel: {
                            FuelTypeId: parseInt(fuelTypeId),
                            FuelTypeName: vehicle.Fuel?.FuelTypeName || "",
                            IsDeleted: false,
                            Vehicles: []
                        },
                        VehicleType: {
                            VehicleTypeId: parseInt(vehicleTypeId),
                            TypeName: vehicle.VehicleType?.TypeName || "",
                            IsDeleted: false,
                            Vehicles: []
                        },
                        Tenant: {
                            TenantId: tenantId,
                            CompanyName: vehicle.Tenant?.CompanyName || "",
                            VATNumber: vehicle.Tenant?.VATNumber || "",
                            IsDeleted: false,
                            Users: [],
                            Vehicles: [],
                            CustomFields: []
                        }
                    }
                };
            }),
            Fuel: {
                FuelTypeId: parseInt(fuelTypeId),
                FuelTypeName: vehicle.Fuel?.FuelTypeName || "",
                IsDeleted: false,
                Vehicles: []
            },
            VehicleType: {
                VehicleTypeId: parseInt(vehicleTypeId),
                TypeName: vehicle.VehicleType?.TypeName || "",
                IsDeleted: false,
                Vehicles: []
            },
            Tenant: {
                TenantId: tenantId,
                CompanyName: vehicle.Tenant?.CompanyName || "",
                VATNumber: vehicle.Tenant?.VATNumber || "",
                IsDeleted: false,
                Users: [],
                Vehicles: [],
                CustomFields: []
            }
        };

        try {
            console.log('Sending update with payload:', updatedVehicle);
            await onUpdateVehicle(updatedVehicle);
            onClose();
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            alert('Failed to update vehicle. Please try again.');
        }
    };

    const handleCustomFieldChange = (fieldName, value, valueType) => {
        setCustomFieldValues(prev => ({
            ...prev,
            [fieldName]: valueType.toLowerCase() === 'boolean' ? value : value
        }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
                <h2 className="text-lg font-bold mb-4">Edit Vehicle</h2>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Brand</label>
                        <input
                            type="text"
                            placeholder="Brand"
                            value={brand || ''}
                            onChange={(e) => setBrand(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Model</label>
                        <input
                            type="text"
                            placeholder="Model"
                            value={model || ''}
                            onChange={(e) => setModel(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium">License Plate</label>
                        <input
                            type="text"
                            placeholder="License Plate"
                            value={licensePlate || ''}
                            onChange={(e) => setLicensePlate(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Chassis Number</label>
                        <input
                            type="text"
                            placeholder="Chassis Number"
                            value={chassisNumber || ''}
                            onChange={(e) => setChassisNumber(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Vehicle Type</label>
                        <select
                            value={vehicleTypeId || ''}
                            onChange={(e) => setVehicleTypeId(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="">Select Vehicle Type</option>
                            {vehicleTypes.map((type) => (
                                <option key={type.VehicleTypeId} value={type.VehicleTypeId}>
                                    {type.TypeName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Fuel Type</label>
                        <select
                            value={fuelTypeId || ''}
                            onChange={(e) => setFuelTypeId(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        >
                            <option value="">Select Fuel Type</option>
                            {fuelTypes.map((type) => (
                                <option key={type.FuelTypeId} value={type.FuelTypeId}>
                                    {type.FuelTypeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Color</label>
                        <input
                            type="text"
                            placeholder="Color"
                            value={color || ''}
                            onChange={(e) => setColor(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                        />
                    </div>
                </div>

                {/* Custom Fields */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
                    {customFields.map((field) => {
                        const value = customFieldValues[field.FieldName];
                        const isBoolean = field.ValueType.toLowerCase() === 'boolean';
                        const displayValue = isBoolean ? (value ? 'Yes' : 'No') : value;

                        return (
                            <div key={field.FieldName} className="mb-4">
                                <label className="block text-sm font-medium mb-2">{field.FieldName}</label>
                                {isBoolean ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={value || false}
                                            onChange={(e) => handleCustomFieldChange(field.FieldName, e.target.checked, field.ValueType)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600">
                                            {displayValue}
                                        </span>
                                    </div>
                                ) : (
                                    <input
                                        type={field.ValueType.toLowerCase() === 'datetime' ? 'date' : 
                                              field.ValueType.toLowerCase() === 'int' ? 'number' : 'text'}
                                        value={value || ''}
                                        onChange={(e) => handleCustomFieldChange(field.FieldName, e.target.value, field.ValueType)}
                                        className="border border-gray-300 rounded p-2 w-full"
                                    />
                                )}
                            </div>
                        );
                    })}
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

export default EditVehicleModal; 