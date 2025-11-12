using Fleet_Management_BL.DTOs;
using Fleet_Management_BL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Mapper
{
    public static class VehicleMapper
    {
        public static VehicleDTO ToDTO(this Vehicle vehicle)
        {
            return new VehicleDTO
            {
                VehicleId = vehicle.VehicleId,
                TenantId = vehicle.Tenant?.TenantId ?? 0,
                VehicleTypeId = vehicle.VehicleType?.VehicleTypeId ?? 0,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                ChassisNumber = vehicle.ChassisNumber,
                LicensePlate = vehicle.LicensePlate,
                FuelTypeId = vehicle.FuelTypeId,
                Color = vehicle.Color,
                IsDeleted = vehicle.IsDeleted,
                CustomFieldValues = vehicle.CustomFieldValues
            };
        }

        public static List<VehicleDTO> ToDTOList(this IEnumerable<Vehicle> vehicles)
        {
            return vehicles.Select(v => v.ToDTO()).ToList();
        }
    }
}