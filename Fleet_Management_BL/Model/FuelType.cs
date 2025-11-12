using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class FuelType
    {
        public FuelType() { }
        public FuelType(string fuelTypeName, bool isDeleted)
        {
            FuelTypeName = fuelTypeName;
            IsDeleted = isDeleted;
        }

        public FuelType(int fuelTypeId, string fuelTypeName, bool isDeleted)
        {
            FuelTypeId = fuelTypeId;
            FuelTypeName = fuelTypeName;
            IsDeleted = isDeleted;
        }

        public int FuelTypeId { get; set; }
        public string FuelTypeName { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; } 

    }
}
