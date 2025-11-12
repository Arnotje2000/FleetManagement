using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fleet_Management_BL.Model;

namespace Fleet_Management_BL.DTOs
{
    public class VehicleDTO
    {
        public int VehicleId { get; set; }
        public int TenantId { get; set; }
        public int VehicleTypeId { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string ChassisNumber { get; set; }
        public string LicensePlate { get; set; }
        public int FuelTypeId { get; set; }
        public string Color { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<CustomFieldValue> CustomFieldValues { get; set; }
    }
}