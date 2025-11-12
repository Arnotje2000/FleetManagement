import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../utils/Sidebar';
import Card from '../utils/Card';
import axios from 'axios';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [admins, setAdmins] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch tenants
        const tenantsResponse = await axios.get('http://localhost:5054/api/tenant');
        const tenantsData = tenantsResponse.data.$values || [];
        
        // Format tenant data
        const formattedTenants = tenantsData.map(tenant => ({
          TenantId: tenant.tenantId,
          CompanyName: tenant.companyName,
          VATNumber: tenant.vatNumber,
          IsDeleted: tenant.isDeleted
        }));

        // Filter out deleted tenants
        const activeTenants = formattedTenants.filter(tenant => !tenant.IsDeleted);
        setCompanies(activeTenants);

        // Fetch admins for each tenant
        const adminMap = {};
        for (const tenant of activeTenants) {
          try {
            const adminsResponse = await axios.get(`http://localhost:5054/api/tenant/${tenant.TenantId}/users`);
            const adminsData = adminsResponse.data.$values || [];
            
            // Filter and format admin data
            const tenantAdmins = adminsData
              .filter(user => !user.isDeleted && user.clearanceId === 2)
              .map(admin => ({
                UserId: admin.userId,
                Email: admin.email,
                FirstName: admin.firstName,
                LastName: admin.lastName,
                ClearanceId: admin.clearanceId
              }));
            
            adminMap[tenant.TenantId] = tenantAdmins;
          } catch (error) {
            console.error(`Error fetching admins for tenant ${tenant.TenantId}:`, error);
            adminMap[tenant.TenantId] = [];
          }
        }
        setAdmins(adminMap);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCompanies([]);
        setAdmins({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar type="superAdmin" />
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 p-6">Dashboard</h1>
        <div className="grid grid-cols-1 gap-1 px-6">
          {isLoading ? (
            <Card>
              <div className="flex items-center justify-center p-4">
                <p className="text-gray-600">Loading companies...</p>
              </div>
            </Card>
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <Card key={company.TenantId} title={company.CompanyName} className="mb-6">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Company Name:</span> {company.CompanyName}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">VAT Number:</span> {company.VATNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Administrators:</span>{' '}
                    {admins[company.TenantId]?.length > 0 ? (
                      admins[company.TenantId].map((admin, idx) => (
                        <React.Fragment key={admin.UserId}>
                          {idx > 0 && ', '}
                          <a href={`mailto:${admin.Email}`} className="text-blue-500 hover:underline">
                            {admin.Email}
                          </a>
                        </React.Fragment>
                      ))
                    ) : (
                      'No administrators available'
                    )}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="flex items-center justify-center p-4">
                <p className="text-gray-600">No companies found.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;