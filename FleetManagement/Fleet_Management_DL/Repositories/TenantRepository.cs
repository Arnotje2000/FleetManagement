using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Fleet_Management_DL;
using Microsoft.EntityFrameworkCore;

namespace Fleet_Management_BL.Repository
{
    public class TenantRepository : ITenantRepository
    {
        private readonly Fleet_ManagementDBContext ctx;
        public TenantRepository(Fleet_ManagementDBContext _ctx)
        {
            ctx = _ctx;
        }

        public async Task<Tenant> AddTenantAsync(Tenant tenant)
        {
            ctx.Set<Tenant>().Add(tenant);
            await ctx.SaveChangesAsync();
            return tenant;
        }

        public async Task<Tenant> DeleteTenantAsync(int tenantId)
        {
            var tenant = await ctx.Set<Tenant>().FindAsync(tenantId);
            if (tenant != null)
            {
                tenant.IsDeleted = true;
                await ctx.SaveChangesAsync();
            }
            return tenant;
        }

        public async Task<Tenant> UpdateTenantAsync(Tenant tenant)
        {
            var existingTenant = await ctx.Set<Tenant>().FindAsync(tenant.TenantId);
            if (existingTenant != null)
            {
                existingTenant.CompanyName = tenant.CompanyName;
                existingTenant.VATNumber = tenant.VATNumber;
                existingTenant.IsDeleted = tenant.IsDeleted;
                await ctx.SaveChangesAsync();
            }
            return existingTenant;
        }

        public async Task<Tenant> GetTenantByIdAsync(int tenantId)
        {
            return await ctx.Tenants
                .Include(t => t.Users)
                .Include(t => t.Vehicles)
                .Include(t => t.CustomFields)
                .FirstOrDefaultAsync(t => t.TenantId == tenantId)!;
        }

        public async Task<List<Tenant>> GetAllTenantsAsync()
        {
            return await ctx.Set<Tenant>().ToListAsync();
        }

        public async Task<List<User>> GetUsersByTenantIdAsync(int tenantId)
        {
            return await ctx.Users
                .Where(u => u.TenantId == tenantId && !u.IsDeleted) // Adjust based on your model
                .ToListAsync();
        }

        public async Task<CustomField> AddCustomFieldAsync(CustomField customField)
        {
            try
            {
                // Add the custom field
                ctx.CustomFields.Add(customField);
                await ctx.SaveChangesAsync();

                // Get all non-deleted vehicles for this tenant
                var vehicles = await ctx.Vehicle
                    .Where(v => v.TenantId == customField.TenantId && !v.IsDeleted)
                    .ToListAsync();

                // Create custom field values for each vehicle
                var customFieldValues = vehicles.Select(vehicle => new CustomFieldValue
                {
                    VehicleId = vehicle.VehicleId,
                    CustomFieldId = customField.CustomFieldId,
                    Value = customField.ValueType.ToLower() == "boolean" ? "false" : "",
                    IsDeleted = false,
                    ValueType = customField.ValueType  // This is correct, but needs DB configuration
                }).ToList();

                // Add all custom field values in one go
                await ctx.CustomFieldValues.AddRangeAsync(customFieldValues);
                await ctx.SaveChangesAsync();

                return customField;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddCustomFieldAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteCustomFieldAsync(int customFieldId)
        {
            try
            {
                // First, get the custom field with its values
                var customField = await ctx.CustomFields
                    .Include(cf => cf.CustomFieldValues)
                    .FirstOrDefaultAsync(cf => cf.CustomFieldId == customFieldId);

                if (customField == null)
                {
                    return false;
                }

                // First delete all custom field values
                if (customField.CustomFieldValues != null && customField.CustomFieldValues.Any())
                {
                    ctx.CustomFieldValues.RemoveRange(customField.CustomFieldValues);
                }

                // Then delete the custom field itself
                ctx.CustomFields.Remove(customField);

                await ctx.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteCustomFieldAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<CustomField> UpdateCustomFieldAsync(CustomField customField)
        {
            try
            {
                var existingField = await ctx.CustomFields
                    .Include(cf => cf.CustomFieldValues)
                    .FirstOrDefaultAsync(cf => cf.CustomFieldId == customField.CustomFieldId);

                if (existingField == null)
                {
                    return null;
                }

                // Check if value type has changed
                if (existingField.ValueType != customField.ValueType)
                {
                    // Reset all values for this custom field
                    foreach (var value in existingField.CustomFieldValues)
                    {
                        value.Value = customField.ValueType.ToLower() == "boolean" ? "false" : "";
                        value.ValueType = customField.ValueType;
                    }
                }

                // Update the basic properties
                existingField.FieldName = customField.FieldName;
                existingField.ValueType = customField.ValueType;

                await ctx.SaveChangesAsync();
                return existingField;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateCustomFieldAsync: {ex.Message}");
                throw;
            }
        }
    }
}
