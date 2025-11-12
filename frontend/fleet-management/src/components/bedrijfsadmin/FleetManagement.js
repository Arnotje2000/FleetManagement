import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../utils/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import Card from '../utils/Card';
import EditVehicleModal from '../utils/EditVehicleModal';
import axios from 'axios';
import '../../App.css';

const FleetManagement = ({ onVehicleDelete }) => {
  const { user } = useContext(AuthContext);
  const tenantId = user?.tenantId;
  const [vehicles, setVehicles] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldValues, setCustomFieldValues] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState([]);

  const resolveCustomFields = (vehicleResponse, customFieldsResponse) => {
    // Extract custom fields from the vehicle response
    const customFieldsMap = {};
    const customFieldsArray = vehicleResponse.customFields?.$values || [];
    
    customFieldsArray.forEach(field => {
      customFieldsMap[field.$id] = field;
    });

    // Resolve references in the custom fields response
    const resolvedCustomFields = customFieldsResponse.$values.map(field => {
      if (field.$ref) {
        // Replace reference with actual data
        return customFieldsMap[field.$ref];
      }
      return field;
    });

    return resolvedCustomFields;
  };

  useEffect(() => {
    const fetchVehiclesWithCustomFields = async () => {
      if (!tenantId) return;

      try {
        // Fetch tenant data to get all custom fields
        const tenantResponse = await axios.get(`http://localhost:5054/api/tenant/${tenantId}`);
        const tenantData = tenantResponse.data;
        
        // Get custom fields from tenant data
        const tenantCustomFields = tenantData.customFields?.$values || [];
        const activeCustomFields = tenantCustomFields
          .filter(field => !field.isDeleted)
          .map(field => ({
            CustomFieldId: field.customFieldId,
            FieldName: field.fieldName,
            ValueType: field.valueType,
            IsDeleted: field.isDeleted
          }));

        setCustomFields(activeCustomFields);

        // Fetch vehicles with details
        const vehiclesResponse = await axios.get(`http://localhost:5054/api/vehicles/${tenantId}`);
        console.log('Vehicles response:', vehiclesResponse.data);

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
      }
    };

    const fetchFuelTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5054/api/vehicles/fueltypes');
        if (response.data) {
          const types = response.data.$values || [];
          const formattedTypes = types.map(type => ({
            FuelTypeId: type.fuelTypeId,
            FuelTypeName: type.fuelTypeName
          }));
          setFuelTypes(formattedTypes);
        }
      } catch (error) {
        console.error('Error fetching fuel types:', error);
        setFuelTypes([]);
      }
    };

    const fetchVehicleTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5054/api/vehicles/types');
        if (response.data) {
          const types = response.data.$values || [];
          const formattedTypes = types.map(type => ({
            VehicleTypeId: type.vehicleTypeId,
            TypeName: type.typeName
          }));
          setVehicleTypes(formattedTypes);
        }
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        setVehicleTypes([]);
      }
    };

    fetchVehiclesWithCustomFields();
    fetchVehicleTypes();
    fetchFuelTypes();
  }, [tenantId, refresh]);

  const handleUpdateVehicle = async (vehicle) => {
    try {
      // Create a complete tenant object
      const tenant = {
        TenantId: tenantId,
        CompanyName: vehicle.Tenant?.CompanyName || "Default Company",
        VATNumber: vehicle.Tenant?.VATNumber || "Default VAT",
        IsDeleted: false,
        Users: [],
        Vehicles: [],
        CustomFields: []
      };

      // Create a complete vehicle object that will be referenced in custom field values
      const completeVehicle = {
        VehicleId: vehicle.VehicleId,
        TenantId: tenantId,
        Tenant: tenant,
        Brand: vehicle.Brand,
        Model: vehicle.Model,
        LicensePlate: vehicle.LicensePlate,
        ChassisNumber: vehicle.ChassisNumber,
        Color: vehicle.Color,
        FuelTypeId: vehicle.FuelTypeId,
        VehicleTypeId: vehicle.VehicleTypeId,
        IsDeleted: false,
        CustomFieldValues: [],
        VehicleType: {
          VehicleTypeId: vehicle.VehicleTypeId,
          TypeName: vehicleTypes.find(vt => vt.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || "",
          IsDeleted: false,
          Vehicles: []
        },
        Fuel: {
          FuelTypeId: vehicle.FuelTypeId,
          FuelTypeName: fuelTypes.find(ft => ft.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || "",
          IsDeleted: false,
          Vehicles: []
        }
      };
      
      // Create the vehicle object with all required fields
      const vehicleToUpdate = {
        ...completeVehicle,
        CustomFieldValues: vehicle.CustomFieldValues.map(cfv => {
          const customField = customFields.find(cf => cf.CustomFieldId === cfv.CustomFieldId);
          
          return {
            CustomFieldValueId: cfv.CustomFieldValueId,
            VehicleId: vehicle.VehicleId,
            CustomFieldId: cfv.CustomFieldId,
            Value: cfv.Value,
            ValueType: cfv.ValueType,
            IsDeleted: false,
            CustomField: {
              CustomFieldId: cfv.CustomFieldId,
              FieldName: customField?.FieldName || "",
              ValueType: cfv.ValueType,
              TenantId: tenantId,
              IsDeleted: false,
              Tenant: tenant
            },
            Vehicle: completeVehicle
          };
        })
      };

      console.log('Updating vehicle:', {
        id: vehicle.VehicleId,
        brand: vehicle.Brand,
        model: vehicle.Model,
        customFields: vehicleToUpdate.CustomFieldValues.map(cf => ({
          fieldId: cf.CustomFieldId,
          value: cf.Value,
          type: cf.ValueType
        }))
      });
      
      const response = await axios.put(`http://localhost:5054/api/vehicles/${vehicle.VehicleId}`, vehicleToUpdate);
      console.log('Vehicle updated successfully');
      
      // Update the local vehicles state with the updated vehicle
      setVehicles(prevVehicles => {
        const updatedVehicles = prevVehicles.map(v => {
          if (v.VehicleId === vehicle.VehicleId) {
            // Return the updated vehicle with all its properties
            return {
              ...v,
              Brand: vehicle.Brand,
              Model: vehicle.Model,
              LicensePlate: vehicle.LicensePlate,
              ChassisNumber: vehicle.ChassisNumber,
              Color: vehicle.Color,
              FuelTypeId: vehicle.FuelTypeId,
              VehicleTypeId: vehicle.VehicleTypeId,
              CustomFieldValues: vehicleToUpdate.CustomFieldValues.map(cfv => ({
                ...cfv,
                Value: cfv.Value
              }))
            };
          }
          return v;
        });
        return updatedVehicles;
      });

      // Close the modal
      setIsEditModalOpen(false);
      
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', error.response?.data?.errors || error.message);
      throw error;
    }
  };

  const handleUpdateCustomField = async (vehicleId, fieldName, value) => {
    try {
      // Get the vehicle and custom field
      const vehicle = vehicles.find(v => v.VehicleId === vehicleId);
      const customField = customFields.find(f => f.FieldName === fieldName);
      
      if (!vehicle || !customField) {
        throw new Error('Vehicle or custom field not found');
      }

      // Find existing custom field value or create new one
      const existingValue = vehicle.CustomFieldValues?.find(
        cfv => cfv.CustomFieldId === customField.CustomFieldId
      );

      // If this is a boolean field and no value exists, default to false
      let finalValue = value;
      if (customField.ValueType.toLowerCase() === 'boolean' && !existingValue) {
        finalValue = 'false';
      }

      // Create the custom field value
      const customFieldValue = {
        customFieldValueId: existingValue?.CustomFieldValueId || 0,
        vehicleId: vehicleId,
        customFieldId: customField.CustomFieldId,
        value: finalValue.toString(),
        isDeleted: false,
        valueType: customField.ValueType,
        vehicle: {
          vehicleId: vehicle.VehicleId,
          brand: vehicle.Brand,
          model: vehicle.Model,
          licensePlate: vehicle.LicensePlate,
          chassisNumber: vehicle.ChassisNumber || "",
          fuelTypeId: vehicle.FuelTypeId,
          color: vehicle.Color,
          vehicleTypeId: vehicle.VehicleTypeId,
          tenantId: tenantId,
          isDeleted: false,
          fuel: {
            fuelTypeId: vehicle.FuelTypeId,
            fuelTypeName: fuelTypes.find(f => f.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || ""
          },
          vehicleType: {
            vehicleTypeId: vehicle.VehicleTypeId,
            typeName: vehicleTypes.find(vt => vt.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || ""
          },
          tenant: {
            tenantId: tenantId
          }
        },
        customField: {
          customFieldId: customField.CustomFieldId,
          fieldName: customField.FieldName,
          valueType: customField.ValueType,
          tenantId: tenantId
        }
      };

      // Update the vehicle with the new custom field value
      const updatedVehicle = {
        vehicleId: vehicle.VehicleId,
        brand: vehicle.Brand,
        model: vehicle.Model,
        licensePlate: vehicle.LicensePlate,
        chassisNumber: vehicle.ChassisNumber || "",
        fuelTypeId: vehicle.FuelTypeId,
        color: vehicle.Color,
        vehicleTypeId: vehicle.VehicleTypeId,
        tenantId: tenantId,
        isDeleted: false,
        fuel: {
          fuelTypeId: vehicle.FuelTypeId,
          fuelTypeName: fuelTypes.find(f => f.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || ""
        },
        vehicleType: {
          vehicleTypeId: vehicle.VehicleTypeId,
          typeName: vehicleTypes.find(vt => vt.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || ""
        },
        tenant: {
          tenantId: tenantId
        },
        customFieldValues: [customFieldValue]
      };

      await axios.put(
        `http://localhost:5054/api/vehicles/${vehicleId}`,
        updatedVehicle
      );

      // Refresh the view
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error updating custom field:', error);
      alert('Failed to update custom field. Please try again.');
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      const response = await axios.delete(`http://localhost:5054/api/vehicles/${vehicleId}`);
      
      if (response.status === 200) {
        // Refresh the vehicle list to reflect the deletion
        setRefresh(prev => !prev);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const getDisplayValue = (vehicle, customField) => {
    if (!vehicle || !customField || !customField.ValueType) return '';

    // Find the custom field value for this vehicle and custom field
    const fieldValue = vehicle.CustomFieldValues?.find(
      cfv => cfv.CustomFieldId === customField.CustomFieldId
    );

    if (!fieldValue || fieldValue.Value === undefined || fieldValue.Value === null) return 'N/A';

    // Handle display based on value type
    const valueType = customField.ValueType.toLowerCase();
    switch (valueType) {
      case 'boolean':
        // Handle both string and boolean values
        if (typeof fieldValue.Value === 'boolean') {
          return fieldValue.Value ? 'Yes' : 'No';
        }
        return fieldValue.Value.toLowerCase() === 'true' ? 'Yes' : 'No';
      case 'string':
      case 'number':
      case 'int':
      case 'datetime':
      default:
        return fieldValue.Value || 'N/A';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="bedrijfsAdmin" />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Fleet Management</h1>
        <div className="grid grid-cols-1 gap-1">
          <Card title="Company Vehicles" className="shadow-md shadow-gray-300">
            <div className="table-container overflow-x-auto">
              <table className="min-w-full mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center">Actions</th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Brand</th>
                    <th className="px-4 py-2 text-left">Model</th>
                    <th className="px-4 py-2 text-left">License Plate</th>
                    <th className="px-4 py-2 text-left">Chassis Number</th>
                    <th className="px-4 py-2 text-left">Fuel Type</th>
                    <th className="px-4 py-2 text-left">Color</th>
                    <th className="px-4 py-2 text-left">Vehicle Type</th>
                    {/* Dynamic Custom Fields Header */}
                    {customFields?.filter(cf => !cf.IsDeleted).map((customField, index) => (
                      <th 
                        key={customField.CustomFieldId || `custom-field-${index}`} 
                        className="px-4 py-2 text-left"
                      >
                        {customField.FieldName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles?.map((vehicle, index) => (
                    <tr 
                      key={`vehicle-${vehicle.VehicleId}-${index}`}
                      className="border-b border-gray-300 border-opacity-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-center">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => {
                            setSelectedVehicle({
                              ...vehicle,
                              customFields: customFields.map(field => {
                                const fieldValue = vehicle.CustomFieldValues?.find(
                                  cfv => cfv.CustomFieldId === field.CustomFieldId
                                );
                                return {
                                  ...field,
                                  Value: fieldValue?.Value || ''
                                };
                              })
                            });
                            setIsEditModalOpen(true);
                          }}
                        >
                          <i className="fi fi-rr-pencil"></i>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(vehicle.VehicleId)}
                        >
                          <i className="fi fi-rr-trash"></i>
                        </button>
                      </td>
                      <td className="px-4 py-2">{vehicle.VehicleId}</td>
                      <td className="px-4 py-2">{vehicle.Brand}</td>
                      <td className="px-4 py-2">{vehicle.Model}</td>
                      <td className="px-4 py-2">{vehicle.LicensePlate}</td>
                      <td className="px-4 py-2">{vehicle.ChassisNumber || 'N/A'}</td>
                      <td className="px-4 py-2">{fuelTypes.find(fuel => fuel.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || 'N/A'}</td>
                      <td className="px-4 py-2">{vehicle.Color}</td>
                      <td className="px-4 py-2">{vehicleTypes.find(type => type.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || 'N/A'}</td>
                      {/* Custom Fields */}
                      {customFields?.filter(cf => !cf.IsDeleted).map((customField, fieldIndex) => (
                        <td 
                          key={`field-${vehicle.VehicleId}-${customField.CustomFieldId}-${fieldIndex}`}
                          className="px-4 py-2"
                        >
                          {getDisplayValue(vehicle, customField)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Vehicle Modal */}
      <EditVehicleModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        vehicle={selectedVehicle} 
        onUpdateVehicle={handleUpdateVehicle} 
        onUpdateCustomField={handleUpdateCustomField}
        customFields={customFields}
        vehicleTypes={vehicleTypes}
        fuelTypes={fuelTypes}
      />
    </div>
  );
};

export default FleetManagement;