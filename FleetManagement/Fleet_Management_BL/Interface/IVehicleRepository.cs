using Fleet_Management_BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Interface
{
    public interface IVehicleRepository
    {
        Task<Vehicle> AddVehicleAsync(Vehicle vehicle);
        Task<Vehicle> DeleteVehicleAsync(int vehicleId);
        Task<Vehicle> UpdateVehicleAsync(Vehicle vehicle);
        Task<Vehicle> GetVehicleByIdAsync(int vehicleId);
        Task<List<Vehicle>> GetVehiclesAsync(int tenantId);
        Task<IEnumerable<VehicleType>> GetVehicleTypesAsync();
        Task<IEnumerable<FuelType>> GetFuelTypesAsync();
        Task<CustomFieldValue> AddCustomFieldValueAsync(CustomFieldValue customFieldValue);
        Task<CustomFieldValue> UpdateCustomFieldValueAsync(CustomFieldValue customFieldValue);
        Task<IEnumerable<CustomField>> GetAllCustomFieldsAsync(int tenantId);
    }
}
