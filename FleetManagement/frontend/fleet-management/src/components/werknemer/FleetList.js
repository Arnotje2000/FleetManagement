import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../utils/Sidebar';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Card from '../utils/Card';

const FleetList = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.tenantId) return;

            try {
                // Fetch fuel types
                const fuelTypesResponse = await axios.get('http://localhost:5054/api/vehicles/fueltypes');
                const fuelTypesData = fuelTypesResponse.data.$values || [];
                const formattedFuelTypes = fuelTypesData.map(type => ({
                    FuelTypeId: type.fuelTypeId,
                    FuelTypeName: type.fuelTypeName
                }));
                setFuelTypes(formattedFuelTypes);

                // Fetch vehicle types
                const vehicleTypesResponse = await axios.get('http://localhost:5054/api/vehicles/types');
                const vehicleTypesData = vehicleTypesResponse.data.$values || [];
                const formattedVehicleTypes = vehicleTypesData.map(type => ({
                    VehicleTypeId: type.vehicleTypeId,
                    TypeName: type.typeName
                }));
                setVehicleTypes(formattedVehicleTypes);

                // Fetch vehicles with details
                const vehiclesResponse = await axios.get(`http://localhost:5054/api/vehicles/${user.tenantId}`);
                console.log('Vehicles response:', vehiclesResponse.data);

                // Extract unique custom fields from the vehicle response
                const customFieldsMap = new Map();
                vehiclesResponse.data.$values.forEach(vehicle => {
                    vehicle.customFieldValues?.$values?.forEach(cfv => {
                        if (cfv.customField && !customFieldsMap.has(cfv.customField.customFieldId)) {
                            customFieldsMap.set(cfv.customField.customFieldId, {
                                CustomFieldId: cfv.customField.customFieldId,
                                FieldName: cfv.customField.fieldName,
                                ValueType: cfv.customField.valueType,
                                IsDeleted: cfv.customField.isDeleted
                            });
                        }
                    });
                });

                const validCustomFields = Array.from(customFieldsMap.values());
                console.log('Valid custom fields:', validCustomFields);
                setCustomFields(validCustomFields);

                // Process vehicles
                const vehiclesData = vehiclesResponse.data.$values || [];
                const validVehicles = vehiclesData.map(vehicle => ({
                    VehicleId: vehicle.vehicleId,
                    Brand: vehicle.brand,
                    Model: vehicle.model,
                    LicensePlate: vehicle.licensePlate,
                    ChassisNumber: vehicle.chassisNumber,
                    FuelTypeId: vehicle.fuelTypeId,
                    Color: vehicle.color,
                    VehicleTypeId: vehicle.vehicleTypeId,
                    CustomFieldValues: (vehicle.customFieldValues?.$values || []).map(cfv => ({
                        CustomFieldId: cfv.customField?.customFieldId,
                        CustomFieldValueId: cfv.customFieldValueId,
                        Value: cfv.value,
                        ValueType: cfv.customField?.valueType,
                        IsDeleted: cfv.isDeleted
                    }))
                }));

                console.log('Processed vehicles:', validVehicles);
                setVehicles(validVehicles);
            } catch (error) {
                console.error('Error fetching data:', error);
                setVehicles([]);
                setCustomFields([]);
                setFuelTypes([]);
                setVehicleTypes([]);
            }
        };

        fetchData();
    }, [user?.tenantId]);

    // Helper function to get custom field value
    const getDisplayValue = (vehicle, customField) => {
        if (!vehicle || !customField || !customField.ValueType) return '';

        const fieldValue = vehicle.CustomFieldValues?.find(
            cfv => cfv.CustomFieldId === customField.CustomFieldId
        );

        if (!fieldValue || fieldValue.Value === undefined || fieldValue.Value === null) return '';

        const valueType = customField.ValueType.toLowerCase();
        switch (valueType) {
            case 'boolean':
                if (typeof fieldValue.Value === 'boolean') {
                    return fieldValue.Value ? 'Yes' : 'No';
                }
                return fieldValue.Value.toLowerCase() === 'true' ? 'Yes' : 'No';
            default:
                return fieldValue.Value;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar type="werknemer" />
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Fleet Management</h1>
                <div className="grid grid-cols-1 gap-1">
                    <Card title="Company Vehicles" className="shadow-md shadow-gray-300">
                        <table className="min-w-full mt-4 bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border-b">ID</th>
                                    <th className="py-2 px-4 border-b">Brand</th>
                                    <th className="py-2 px-4 border-b">Model</th>
                                    <th className="py-2 px-4 border-b">License Plate</th>
                                    <th className="py-2 px-4 border-b">Chassis Number</th>
                                    <th className="py-2 px-4 border-b">Fuel Type</th>
                                    <th className="py-2 px-4 border-b">Vehicle Type</th>
                                    <th className="py-2 px-4 border-b">Color</th>
                                    {customFields.map(field => (
                                        <th key={field.CustomFieldId} className="py-2 px-4 border-b">{field.FieldName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.VehicleId} className="hover:bg-gray-100">
                                        <td className="py-2 px-4 border-b">{vehicle.VehicleId}</td>
                                        <td className="py-2 px-4 border-b">{vehicle.Brand}</td>
                                        <td className="py-2 px-4 border-b">{vehicle.Model}</td>
                                        <td className="py-2 px-4 border-b">{vehicle.LicensePlate}</td>
                                        <td className="py-2 px-4 border-b">{vehicle.ChassisNumber || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{fuelTypes.find(ft => ft.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{vehicleTypes.find(vt => vt.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{vehicle.Color}</td>
                                        {customFields.map(field => (
                                            <td key={field.CustomFieldId} className="py-2 px-4 border-b">
                                                {getDisplayValue(vehicle, field) || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FleetList;