import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../utils/Sidebar';
import Card from '../utils/Card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const StatisticsManagement = () => {
    const { user } = useContext(AuthContext);
    const tenantId = user?.tenantId;
    const [employees, setEmployees] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [fuelTypes, setFuelTypes] = useState([]);
    const [fuelTypeStats, setFuelTypeStats] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [customFields, setCustomFields] = useState([]);

    // Fetch users (employees and admins) from the tenant endpoint
    useEffect(() => {
        const fetchEmployeesAndAdmins = async () => {
            if (!tenantId) {
                console.log('No tenantId provided');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5054/api/tenant/${tenantId}`);
                const users = response.data.users?.$values || [];
                
                // Filter out deleted users and map to correct structure
                const processedUsers = users.filter(user => !user.isDeleted).map(user => ({
                    userId: user.userId,
                    email: user.email,
                    isDeleted: user.isDeleted
                }));

                // For now, we'll consider users with 'admin' in their email as admins
                const employeesList = processedUsers.filter(user => !user.email.toLowerCase().includes('admin'));
                const adminsList = processedUsers.filter(user => user.email.toLowerCase().includes('admin'));

                setEmployees(employeesList);
                setAdmins(adminsList);
            } catch (error) {
                console.error('Error fetching users:', error);
                setEmployees([]);
                setAdmins([]);
            }
        };

        if (tenantId) {
            fetchEmployeesAndAdmins();
        }
    }, [tenantId]);

    // Combined useEffect for fetching all vehicle-related data
    useEffect(() => {
        if (!tenantId) {
            console.warn('Tenant ID is not available');
            return;
        }

        const fetchAllData = async () => {
            try {
                // Fetch fuel types first
                const fuelTypesResponse = await axios.get('http://localhost:5054/api/vehicles/fueltypes');
                const fuelTypesData = fuelTypesResponse.data.$values || [];
                const formattedFuelTypes = fuelTypesData.map(type => ({
                    FuelTypeId: type.fuelTypeId,
                    FuelTypeName: type.fuelTypeName
                }));
                setFuelTypes(formattedFuelTypes);
                console.log('Fuel types loaded:', formattedFuelTypes);

                // Fetch vehicle types
                const vehicleTypesResponse = await axios.get('http://localhost:5054/api/vehicles/types');
                const vehicleTypesData = vehicleTypesResponse.data.$values || [];
                const formattedVehicleTypes = vehicleTypesData.map(type => ({
                    VehicleTypeId: type.vehicleTypeId,
                    TypeName: type.typeName
                }));
                setVehicleTypes(formattedVehicleTypes);
                console.log('Vehicle types loaded:', formattedVehicleTypes);

                // Fetch vehicles with details
                const vehiclesResponse = await axios.get(`http://localhost:5054/api/vehicles/${tenantId}`);
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
                const validVehicles = vehiclesData.filter(vehicle => !vehicle.isDeleted).map(vehicle => ({
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

                // Calculate fuel type statistics
                const fuelTypeCounts = validVehicles.reduce((acc, vehicle) => {
                    const fuelType = formattedFuelTypes.find(ft => ft.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || 'Unknown';
                    acc[fuelType] = (acc[fuelType] || 0) + 1;
                    return acc;
                }, {});

                const stats = Object.entries(fuelTypeCounts).map(([fuelTypeName, count]) => ({
                    FuelTypeName: fuelTypeName,
                    count: count
                }));
                setFuelTypeStats(stats);
                console.log('Fuel type statistics:', stats);

            } catch (error) {
                console.error('Error fetching data:', error);
                setVehicles([]);
                setFuelTypes([]);
                setVehicleTypes([]);
                setFuelTypeStats([]);
                setCustomFields([]);
            }
        };

        fetchAllData();
    }, [tenantId]);

    // Retrieve logged-in user from local storage on component mount
    useEffect(() => {
        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            setLoggedInUser(JSON.parse(userData));
        }
    }, []);

    const fuelTypeChartData = {
        labels: fuelTypeStats.map(f => f.FuelTypeName),
        datasets: [{
            data: fuelTypeStats.map(f => f.count),
            backgroundColor: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600'],
        }],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    // Helper function to get custom field value
    const getDisplayValue = (vehicle, customField) => {
        if (!vehicle || !customField || !customField.ValueType) return '';

        // Find the custom field value for this vehicle and custom field
        const fieldValue = vehicle.CustomFieldValues?.find(
            cfv => cfv.CustomFieldId === customField.CustomFieldId
        );

        if (!fieldValue || fieldValue.Value === undefined || fieldValue.Value === null) return '';

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
            case 'datetime':
            default:
                return fieldValue.Value;
        }
    };

    // Add new function to calculate custom field statistics
    const calculateCustomFieldStats = (customField) => {
        const values = vehicles.map(vehicle => 
            getDisplayValue(vehicle, customField)
        ).filter(value => value !== '');

        if (customField.ValueType.toLowerCase() === 'boolean') {
            const trueCount = values.filter(v => v === 'Yes').length;
            const falseCount = values.filter(v => v === 'No').length;
            return {
                labels: ['Yes', 'No'],
                data: [trueCount, falseCount]
            };
        } else if (customField.ValueType.toLowerCase() === 'int') {
            const numericValues = values.map(v => parseInt(v)).filter(v => !isNaN(v));
            if (numericValues.length === 0) return null;
            
            const sum = numericValues.reduce((a, b) => a + b, 0);
            const avg = sum / numericValues.length;
            const max = Math.max(...numericValues);
            const min = Math.min(...numericValues);
            
            return {
                average: avg.toFixed(2),
                maximum: max,
                minimum: min,
                count: numericValues.length
            };
        } else {
            // For string and datetime, count unique values
            const valueCounts = values.reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {});
            
            return {
                labels: Object.keys(valueCounts),
                data: Object.values(valueCounts)
            };
        }
    };

    console.log("Logged in user:", loggedInUser);
    console.log("Tenant ID:", tenantId);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar type="bedrijfsAdmin" />
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6">Statistics Management</h1>
                <div className="flex flex-col gap-4 mb-6">
                    <Card title="Total Admins">
                        <p className="text-3xl font-bold text-green-600">{admins.length}</p>
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Contact (Email)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin.userId} className={`border-b border-gray-300 border-opacity-50 ${loggedInUser && loggedInUser.userId === admin.userId ? 'bg-green-200' : ''}`}>
                                        <td className="px-4 py-2">{admin.userId}</td>
                                        <td className="px-4 py-2">{admin.email.split('@')[0]}</td>
                                        <td className="px-4 py-2">Admin</td>
                                        <td className="px-4 py-2">{admin.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>

                    <Card title="Total Employees">
                        <p className="text-3xl font-bold text-green-600">{employees.length}</p>
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Role</th>
                                    <th className="px-4 py-2 text-left">Contact (Email)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.userId} className={`border-b border-gray-300 border-opacity-50 ${loggedInUser && loggedInUser.userId === employee.userId ? 'bg-green-200' : ''}`}>
                                        <td className="px-4 py-2">{employee.userId}</td>
                                        <td className="px-4 py-2">{employee.email.split('@')[0]}</td>
                                        <td className="px-4 py-2">Employee</td>
                                        <td className="px-4 py-2">{employee.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <Card title="Total Vehicles" className="shadow-md shadow-gray-300 w-full">
                        <p className="text-3xl font-bold text-green-600">{vehicles.length}</p>
                        <table className="min-w-full mt-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Brand</th>
                                    <th className="px-4 py-2 text-left">Model</th>
                                    <th className="px-4 py-2 text-left">License Plate</th>
                                    <th className="px-4 py-2 text-left">Chassis Number</th>
                                    <th className="px-4 py-2 text-left">Fuel Type</th>
                                    <th className="px-4 py-2 text-left">Vehicle Type</th>
                                    <th className="px-4 py-2 text-left">Color</th>
                                    {/* Add custom field columns */}
                                    {customFields.map(field => (
                                        <th key={field.CustomFieldId} className="px-4 py-2 text-left">
                                            {field.FieldName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.VehicleId} className="border-b border-gray-300 border-opacity-50">
                                        <td className="px-4 py-2">{vehicle.VehicleId}</td>
                                        <td className="px-4 py-2">{vehicle.Brand}</td>
                                        <td className="px-4 py-2">{vehicle.Model}</td>
                                        <td className="px-4 py-2">{vehicle.LicensePlate}</td>
                                        <td className="px-4 py-2">{vehicle.ChassisNumber || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            {fuelTypes.find(ft => ft.FuelTypeId === vehicle.FuelTypeId)?.FuelTypeName || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {vehicleTypes.find(type => type.VehicleTypeId === vehicle.VehicleTypeId)?.TypeName || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">{vehicle.Color}</td>
                                        {/* Add custom field values */}
                                        {customFields.map(field => (
                                            <td key={field.CustomFieldId} className="px-4 py-2">
                                                {getDisplayValue(vehicle, field) || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <Card title="Vehicle Fuel Type Totals">
                        <div style={{ height: '300px' }}>
                            <Bar data={fuelTypeChartData} options={options} />
                        </div>
                    </Card>
                </div>

                {/* Custom Fields Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {customFields.map(field => {
                        const stats = calculateCustomFieldStats(field);
                        if (!stats) return null;

                        return (
                            <Card key={field.CustomFieldId} title={`${field.FieldName} Statistics`}>
                                <div className="p-4">
                                    {field.ValueType.toLowerCase() === 'int' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-blue-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">Average</p>
                                                    <p className="text-xl font-bold text-blue-600">{stats.average}</p>
                                                </div>
                                                <div className="bg-green-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">Count</p>
                                                    <p className="text-xl font-bold text-green-600">{stats.count}</p>
                                                </div>
                                                <div className="bg-yellow-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">Maximum</p>
                                                    <p className="text-xl font-bold text-yellow-600">{stats.maximum}</p>
                                                </div>
                                                <div className="bg-red-50 p-3 rounded">
                                                    <p className="text-sm text-gray-600">Minimum</p>
                                                    <p className="text-xl font-bold text-red-600">{stats.minimum}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid gap-2">
                                            {stats.labels.map((label, index) => (
                                                <div key={label} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="font-medium">{label}</span>
                                                    <span className="text-blue-600 font-bold">{stats.data[index]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatisticsManagement;