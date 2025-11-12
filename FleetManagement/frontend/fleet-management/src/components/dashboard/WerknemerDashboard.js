import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../utils/Sidebar';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const WerknemerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    const fetchVehiclesWithCustomFields = async () => {
      if (!user?.tenantId) return;

      try {
        // Fetch fuel types first
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

    fetchVehiclesWithCustomFields();
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
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.VehicleId} className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {vehicle.Brand} {vehicle.Model}
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">License Plate:</span> {vehicle.LicensePlate}</p>
                <p><span className="font-medium">Chassis Number:</span> {vehicle.ChassisNumber || 'N/A'}</p>
                <p><span className="font-medium">Fuel Type:</span> {fuelTypes.find(ft => ft.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || 'N/A'}</p>
                <p><span className="font-medium">Vehicle Type:</span> {vehicleTypes.find(vt => vt.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || 'N/A'}</p>
                <p><span className="font-medium">Color:</span> {vehicle.Color}</p>
                {customFields.map(field => (
                  <p key={field.CustomFieldId}>
                    <span className="font-medium">{field.FieldName}:</span>{' '}
                    {getDisplayValue(vehicle, field) || 'N/A'}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WerknemerDashboard;