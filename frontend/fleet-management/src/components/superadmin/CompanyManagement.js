import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../utils/Card';
import Sidebar from '../utils/Sidebar';
import axios from 'axios';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5054/api/tenant');
        const tenantsData = response.data.$values || [];
        
        // Format and filter active tenants
        const activeTenants = tenantsData
          .filter(tenant => !tenant.isDeleted)
          .map(tenant => ({
            TenantId: tenant.tenantId,
            CompanyName: tenant.companyName,
            VATNumber: tenant.vatNumber
          }));

        setCompanies(activeTenants);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = async (event) => {
    const companyId = event.target.value;
    setSelectedCompany(companyId);

    if (!companyId) {
      setEmployeeCount(0);
      setAdminCount(0);
      setAdmins([]);
      setCompanyDetails(null);
      return;
    }

    try {
      // Fetch company details
      const companyResponse = await axios.get(`http://localhost:5054/api/tenant/${companyId}`);
      const companyData = companyResponse.data;
      setCompanyDetails({
        CompanyName: companyData.companyName,
        VATNumber: companyData.vatNumber,
        TenantId: companyData.tenantId
      });

      // Fetch users for the company
      const usersResponse = await axios.get(`http://localhost:5054/api/tenant/${companyId}/users`);
      const usersData = usersResponse.data.$values || [];

      // Filter active users
      const activeUsers = usersData.filter(user => !user.isDeleted);
      
      // Count employees and admins
      const admins = activeUsers.filter(user => user.clearanceId === 2);
      const employees = activeUsers.filter(user => user.clearanceId === 3);
      
      setEmployeeCount(employees.length);
      setAdminCount(admins.length);

      // Format admin data
      const formattedAdmins = admins.map(admin => ({
        UserId: admin.userId,
        Email: admin.email,
        UserName: admin.userName || admin.email.split('@')[0] // Use part before @ if no username
      }));

      setAdmins(formattedAdmins);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setCompanyDetails(null);
      setEmployeeCount(0);
      setAdminCount(0);
      setAdmins([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="superAdmin" />
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 p-6">Company Management</h1>

        <div className="p-6">
          <Card title="Company Selection" className="mb-6">
            <label htmlFor="company-select" className="block mb-2 text-lg font-medium text-gray-700">
              Select Company:
            </label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <p className="text-gray-600">Loading companies...</p>
              </div>
            ) : (
              <select 
                id="company-select" 
                value={selectedCompany} 
                onChange={handleCompanyChange} 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">--Choose a company--</option>
                {companies.map((company) => (
                  <option key={company.TenantId} value={company.TenantId}>
                    {company.CompanyName}
                  </option>
                ))}
              </select>
            )}
          </Card>

          {companyDetails && (
            <Card title="Company Details" className="mb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Company Name:</span>{' '}
                      {companyDetails.CompanyName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">VAT Number:</span>{' '}
                      {companyDetails.VATNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Total Employees:</span>{' '}
                      {employeeCount}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Total Administrators:</span>{' '}
                      {adminCount}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Administrators</h3>
                  {admins.length > 0 ? (
                    <div className="bg-white shadow overflow-hidden rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {admins.map((admin) => (
                          <li key={admin.UserId} className="px-6 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{admin.UserName}</p>
                                <p className="text-sm text-gray-500">
                                  <a href={`mailto:${admin.Email}`} className="text-blue-500 hover:underline">
                                    {admin.Email}
                                  </a>
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600">No administrators found.</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyManagement; 
