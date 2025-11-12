using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fleet_Management_BL.Model
{
    public class Vehicle
    {
        public Vehicle() { }

        public Vehicle(Tenant tenant, VehicleType vehicleType, string brand, string model, string chassisNumber, string licensePlate, FuelType fuel, string color, bool isDeleted)
        {
            Tenant = tenant;
            VehicleType = vehicleType;
            Brand = brand;
            Model = model;
            ChassisNumber = chassisNumber;
            LicensePlate = licensePlate;
            Fuel = fuel;
            Color = color;
            IsDeleted = isDeleted;
        }

        public Vehicle(int vehicleId, Tenant tenant, VehicleType vehicleType, string brand, string model, string chassisNumber, string licensePlate, FuelType fuel, string color, bool isDeleted)
        {
            VehicleId = vehicleId;
            Tenant = tenant;
            VehicleType = vehicleType;
            Brand = brand;
            Model = model;
            ChassisNumber = chassisNumber;
            LicensePlate = licensePlate;
            Fuel = fuel;
            Color = color;
            IsDeleted = isDeleted;
        }

        public int VehicleId { get; set; }
        public Tenant Tenant { get; set; }
        public VehicleType VehicleType { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string ChassisNumber { get; set; }
        public string LicensePlate { get; set; }
        public FuelType Fuel { get; set; }
        public string Color { get; set; }
        public bool IsDeleted { get; set; }
        public int TenantId { get; set; } 
        public int VehicleTypeId { get; set; } 
        public int FuelTypeId { get; set; } 
        public ICollection<CustomFieldValue> CustomFieldValues { get; set; } 

    }
}
