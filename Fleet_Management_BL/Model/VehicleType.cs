using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class VehicleType
    {
        public VehicleType() { }
        public VehicleType(string typeName, bool isDeleted)
        {
            TypeName = typeName;
            IsDeleted = isDeleted;
        }

        public VehicleType(int vehicleTypeId, string typeName, bool isDeleted)
        {
            VehicleTypeId = vehicleTypeId;
            TypeName = typeName;
            IsDeleted = isDeleted;
        }

        public int VehicleTypeId { get; set; }
        public string TypeName { get; set; }
        public bool IsDeleted { get; set; }
        public ICollection<Vehicle> Vehicles { get; set; }

    }
}
