import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../utils/Sidebar';
import Card from '../utils/Card';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BedrijfsAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const tenantId = user?.tenantId;
  const [tenantInfo, setTenantInfo] = useState({});
  const [vehicleData, setVehicleData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);

  useEffect(() => {
    if (!tenantId) return;

    const fetchTenantInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5054/api/tenant/${tenantId}`);
        console.log('Tenant info:', response.data);
        setTenantInfo(response.data);

        // Filter out deleted users
        const users = response.data.users?.$values || [];
        const activeUsers = users.filter(user => !user.isDeleted);
        setUserData(activeUsers);

        // Fetch fuel types from the API
        const fuelTypesResponse = await axios.get('http://localhost:5054/api/vehicles/fueltypes');
        const fuelTypesData = fuelTypesResponse.data.$values || [];
        const fuelTypesMap = fuelTypesData.reduce((acc, type) => {
          acc[type.fuelTypeId] = type.fuelTypeName;
          return acc;
        }, {});

        // Extract vehicles and filter out deleted ones
        const vehicles = response.data.vehicles?.$values || [];
        const activeVehicles = vehicles.filter(vehicle => !vehicle.isDeleted);
        setVehicleData(activeVehicles);

        // Group vehicles by fuel type
        const fuelTypeCounts = activeVehicles.reduce((acc, vehicle) => {
          const fuelTypeName = fuelTypesMap[vehicle.fuelTypeId] || 'Unknown';
          acc[fuelTypeName] = (acc[fuelTypeName] || 0) + 1;
          return acc;
        }, {});

        // Convert to format needed for chart
        const fuelTypeData = Object.entries(fuelTypeCounts).map(([name, count]) => ({
          fuelTypeName: name,
          count: count
        }));
        
        setFuelTypeData(fuelTypeData);
      } catch (error) {
        console.error('Error fetching tenant info:', error);
      }
    };

    fetchTenantInfo();
  }, [tenantId]);

  const totalEmployees = userData.filter(user => !user.email?.toLowerCase().includes('admin')).length;
  const totalAdmins = userData.filter(user => user.email?.toLowerCase().includes('admin')).length;
  const totalVehicles = vehicleData.length;

  const fuelTypeChartData = {
    labels: fuelTypeData.map(ft => ft.fuelTypeName),
    datasets: [{
      data: fuelTypeData.map(ft => ft.count),
      backgroundColor: ['#003F5C', '#58508D', '#BC5090', '#FF6361', '#FFA600'],
      label: 'Vehicles by Fuel Type'
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="bedrijfsAdmin" />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <Card title="Tenant Information" className="mb-6">
          <p className="text-gray-600">Company Name: {tenantInfo.companyName}</p>
          <p className="text-gray-600">VAT Number: {tenantInfo.vatNumber}</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card title="Total Vehicles">
            <p className="text-3xl font-bold text-blue-600">{totalVehicles}</p>
          </Card>
          <Card title="Total Employees">
            <p className="text-3xl font-bold text-blue-600">{totalEmployees}</p>
          </Card>
          <Card title="Total Admins">
            <p className="text-3xl font-bold text-green-600">{totalAdmins}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card title="Vehicle Fuel Type Overview">
            <div style={{ height: '300px' }}>
              <Bar data={fuelTypeChartData} options={options} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BedrijfsAdminDashboard;