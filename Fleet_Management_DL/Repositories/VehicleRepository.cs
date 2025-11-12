using Fleet_Management_BL.Interface;
using Fleet_Management_BL.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_DL.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly Fleet_ManagementDBContext ctx;
        public VehicleRepository(Fleet_ManagementDBContext _ctx)
        {
            ctx = _ctx;
        }

        public async Task<Vehicle> AddVehicleAsync(Vehicle vehicle)
        {
            ctx.Set<Vehicle>().Add(vehicle);
            await ctx.SaveChangesAsync();
            return vehicle;
        }

        public async Task<Vehicle> DeleteVehicleAsync(int vehicleId)
        {
            var vehicle = await ctx.Set<Vehicle>().FindAsync(vehicleId);
            if (vehicle != null)
            {
                vehicle.IsDeleted = true; // Mark as deleted
                await ctx.SaveChangesAsync();
            }
            return vehicle;
        }

        public async Task<Vehicle> GetVehicleByIdAsync(int vehicleId)
        {
            return await ctx.Set<Vehicle>()
                .Include(v => v.Fuel)
                .Include(v => v.Tenant)
                .Include(v => v.VehicleType)
                .Include(v => v.CustomFieldValues)
                    .ThenInclude(cfv => cfv.CustomField)
                .FirstOrDefaultAsync(v => v.VehicleId == vehicleId && !v.IsDeleted);
        }

        public async Task<List<Vehicle>> GetVehiclesAsync(int tenantId)
        {
            try
            {
                return await ctx.Set<Vehicle>()
                    .Include(v => v.Fuel)
                    .Include(v => v.Tenant)
                    .Include(v => v.VehicleType)
                    .Include(v => v.CustomFieldValues)
                        .ThenInclude(cfv => cfv.CustomField)
                    .Where(v => v.Tenant.TenantId == tenantId && !v.IsDeleted)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching vehicles: {ex.Message}");
                return new List<Vehicle>();
            }
        }
        public async Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle)
        {
            var existingVehicle = await ctx.Vehicle
                .Include(v => v.CustomFieldValues)
                    .ThenInclude(cfv => cfv.CustomField)
                .Include(v => v.Fuel)
                .Include(v => v.VehicleType)
                .Include(v => v.Tenant)
                .FirstOrDefaultAsync(v => v.VehicleId == vehicle.VehicleId);

            if (existingVehicle == null)
            {
                throw new Exception($"Vehicle with ID {vehicle.VehicleId} not found");
            }

            // Handle custom field values
            if (vehicle.CustomFieldValues != null)
            {
                foreach (var customFieldValue in vehicle.CustomFieldValues)
                {
                    var existingValue = existingVehicle.CustomFieldValues
                        .FirstOrDefault(cfv => cfv.CustomFieldId == customFieldValue.CustomFieldId);

                    if (existingValue != null)
                    {
                        // Update existing value
                        existingValue.Value = customFieldValue.Value;
                        existingValue.ValueType = customFieldValue.ValueType;
                        existingValue.IsDeleted = customFieldValue.IsDeleted;
                    }
                    else
                    {
                        // Get the custom field
                        var customField = await ctx.CustomFields
                            .Include(cf => cf.Tenant)
                            .FirstOrDefaultAsync(cf => cf.CustomFieldId == customFieldValue.CustomFieldId);

                        if (customField == null)
                        {
                            throw new Exception($"Custom field with ID {customFieldValue.CustomFieldId} not found");
                        }

                        // Create new value with all required navigation properties
                        var newValue = new CustomFieldValue
                        {
                            VehicleId = vehicle.VehicleId,
                            CustomFieldId = customFieldValue.CustomFieldId,
                            Value = customFieldValue.Value,
                            ValueType = customFieldValue.ValueType,
                            IsDeleted = false,
                            Vehicle = existingVehicle,
                            CustomField = customField
                        };

                        // Ensure all required navigation properties are set
                        newValue.Vehicle.Fuel = existingVehicle.Fuel;
                        newValue.Vehicle.VehicleType = existingVehicle.VehicleType;
                        newValue.Vehicle.Tenant = existingVehicle.Tenant;

                        existingVehicle.CustomFieldValues.Add(newValue);
                    }
                }
            }

            await ctx.SaveChangesAsync();
            return existingVehicle;
        }

        public async Task<IEnumerable<VehicleType>> GetVehicleTypesAsync()
        {
            return await ctx.Set<VehicleType>()
                .Where(vt => !vt.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<FuelType>> GetFuelTypesAsync()
        {
            return await ctx.Set<FuelType>()
                .Where(ft => !ft.IsDeleted)
                .ToListAsync();
        }

        public async Task<CustomFieldValue> AddCustomFieldValueAsync(CustomFieldValue customFieldValue)
        {
            ctx.Set<CustomFieldValue>().Add(customFieldValue);
            await ctx.SaveChangesAsync();
            return customFieldValue;
        }

        public async Task<CustomFieldValue> UpdateCustomFieldValueAsync(CustomFieldValue customFieldValue)
        {
            var existingValue = await ctx.Set<CustomFieldValue>()
                .FirstOrDefaultAsync(cf => cf.CustomFieldValueId == customFieldValue.CustomFieldValueId);

            if (existingValue != null)
            {
                existingValue.Value = customFieldValue.Value;
                await ctx.SaveChangesAsync();
            }
            return existingValue;
        }

        public async Task<IEnumerable<CustomField>> GetAllCustomFieldsAsync(int tenantId)
        {
            try
            {
                return await ctx.Set<CustomField>()
                    .Where(cf => cf.TenantId == tenantId && !cf.IsDeleted)
                    .Include(cf => cf.Tenant)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching all custom fields: {ex.Message}");
                return new List<CustomField>();
            }
        }
    }
}
