using Fleet_Management_BL.DTOs;
using Fleet_Management_BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Mapper
{
    public static class TenantMapper
    {
        public static TenantDTO ToDTO(this Tenant tenant)
        {
            return new TenantDTO
            {
                TenantId = tenant.TenantId,
                CompanyName = tenant.CompanyName,
                VATNumber = tenant.VATNumber,
                IsDeleted = tenant.IsDeleted,
                Users = tenant.Users,
                CustomFields = tenant.CustomFields,
                Vehicles = tenant.Vehicles
            };
        }

        public static List<TenantDTO> ToDTOList(this IEnumerable<Tenant> tenants)
        {
            return tenants.Select(t => t.ToDTO()).ToList();
        }
    }
}