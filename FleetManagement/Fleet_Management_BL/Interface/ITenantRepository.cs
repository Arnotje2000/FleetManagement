using Fleet_Management_BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Interface
{
    public interface ITenantRepository
    {
        Task<Tenant> AddTenantAsync(Tenant tenant);
        Task<Tenant> DeleteTenantAsync(int tenantId);
        Task<Tenant> UpdateTenantAsync(Tenant tenant);
        Task<Tenant> GetTenantByIdAsync(int tenantId);
        Task<List<Tenant>> GetAllTenantsAsync();
        Task<List<User>> GetUsersByTenantIdAsync(int tenantId);
        Task<CustomField> AddCustomFieldAsync(CustomField customField);
        Task<bool> DeleteCustomFieldAsync(int customFieldId);
        Task<CustomField> UpdateCustomFieldAsync(CustomField customField);
    }
}
