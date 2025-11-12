using Fleet_Management_BL.Model;
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic.FileIO;
using System.Data;

namespace InlezenDB
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // Use your connection string
            string connectionString = @"Data Source=PCBRAM\SQLEXPRESS;Initial Catalog=FleetManagerDB;Integrated Security=True;Encrypt=False;Trust Server Certificate=True";

            List<Tenant> tenants = new List<Tenant>();
            tenants.Add(new Tenant(1, "HeadCompany", "VAT123463", false));
            tenants.Add(new Tenant(2, "Company A", "VAT123456", false));
            tenants.Add(new Tenant(3, "Company B", "VAT123457", false));
            tenants.Add(new Tenant(4, "Company C", "VAT123458", false));
            tenants.Add(new Tenant(5, "Company D", "VAT123459", false));
            tenants.Add(new Tenant(6, "Company E", "VAT123460", false));
            tenants.Add(new Tenant(7, "Company F", "VAT123461", false));
            tenants.Add(new Tenant(8, "Company G", "VAT123462", false));
            foreach (Tenant tenant in tenants)
            {
                TenantOpslaanInDb(tenant, connectionString);
            }

            List<Clearance> clearances = new();
            clearances.Add(new Clearance(1, 1, "Super Admin", false));
            clearances.Add(new Clearance(2, 2, "Tenant Admin", false));
            clearances.Add(new Clearance(3, 3, "Employee", false));
            foreach (Clearance clearance in clearances)
            {
                ClearanceOpslaanInDb(clearance, connectionString);
            }

            List<FuelType> fuelTypes = new List<FuelType>();
            fuelTypes.Add(new FuelType(1, "Petrol", false));
            fuelTypes.Add(new FuelType(2, "Diesel", false));
            fuelTypes.Add(new FuelType(3, "Electric", false));
            fuelTypes.Add(new FuelType(4, "Hybrid", false));
            foreach (FuelType fuelType in fuelTypes)
            {
                FuelTypeOpslaanInDb(fuelType, connectionString);
            }

            List<VehicleType> vehicleTypes = new List<VehicleType>();
            vehicleTypes.Add(new VehicleType(1, "Sedan", false));
            vehicleTypes.Add(new VehicleType(2, "Cabriolet", false));
            vehicleTypes.Add(new VehicleType(3, "Stationwagen", false));
            vehicleTypes.Add(new VehicleType(4, "Crossover", false));
            foreach (VehicleType vehicleType in vehicleTypes)
            {
                VehicleTypeOpslaanInDb(vehicleType, connectionString);
            }

            List<User> users = new List<User>();
            users.Add(new User(1, tenants[0], "superadmin", "root", "superadmin@example.com", clearances[2], false));
            users.Add(new User(2, tenants[1], "adminA1", "root", "adminA1@example.com", clearances[1], false));
            users.Add(new User(3, tenants[1], "adminA2", "root", "adminA2@example.com", clearances[1], false));
            users.Add(new User(4, tenants[1], "employeeA1", "root", "employeeA1@example.com", clearances[2], false));
            users.Add(new User(5, tenants[1], "employeeA2", "root", "employeeA2@example.com", clearances[2], false));
            users.Add(new User(6, tenants[1], "employeeA3", "root", "employeeA3@example.com", clearances[2], false));
            // Add the rest of the users from your screenshot...
            foreach (User user in users)
            {
                UserOpslaanInDb(user, connectionString);
            }

            List<Vehicle> vehicles = new List<Vehicle>();
            vehicles.Add(new Vehicle(1, tenants[1], vehicleTypes[0], "Ford", "Focus", "GH789", "XYZ-789", fuelTypes[0], "Green", false));
            vehicles.Add(new Vehicle(2, tenants[1], vehicleTypes[0], "Ford", "Focus", "GH790", "XYZ-790", fuelTypes[1], "Green", false));
            vehicles.Add(new Vehicle(3, tenants[1], vehicleTypes[1], "Chevrolet", "Malibu", "JKL012", "XYZ-012", fuelTypes[1], "Black", false));
            vehicles.Add(new Vehicle(4, tenants[1], vehicleTypes[1], "Chevrolet", "Malibu", "JKL013", "XYZ-013", fuelTypes[2], "Black", false));
            vehicles.Add(new Vehicle(5, tenants[1], vehicleTypes[2], "Tesla", "Model S", "TES123", "TES-123", fuelTypes[2], "Red", false));
            vehicles.Add(new Vehicle(6, tenants[1], vehicleTypes[2], "Toyota", "Prius", "PRI456", "PRI-456", fuelTypes[3], "Blue", false));
            vehicles.Add(new Vehicle(7, tenants[2], vehicleTypes[0], "Nissan", "Altima", "MNO345", "XYZ-345", fuelTypes[1], "White", false));
            vehicles.Add(new Vehicle(8, tenants[2], vehicleTypes[0], "Nissan", "Altima", "MNO346", "XYZ-346", fuelTypes[1], "White", false));
            vehicles.Add(new Vehicle(9, tenants[2], vehicleTypes[1], "Hyundai", "Elantra", "PQR678", "XYZ-678", fuelTypes[2], "Yellow", false));
            vehicles.Add(new Vehicle(10, tenants[2], vehicleTypes[1], "Hyundai", "Elantra", "PQR679", "XYZ-679", fuelTypes[2], "Yellow", false));
            vehicles.Add(new Vehicle(11, tenants[2], vehicleTypes[0], "Nissan", "Altima", "MNO347", "XYZ-347", fuelTypes[1], "White", false));
            vehicles.Add(new Vehicle(12, tenants[2], vehicleTypes[0], "Nissan", "Leaf", "LEA789", "LEA-789", fuelTypes[2], "Green", false));
            vehicles.Add(new Vehicle(13, tenants[3], vehicleTypes[0], "Kia", "Forte", "STU901", "XYZ-901", fuelTypes[1], "Silver", false));
            vehicles.Add(new Vehicle(14, tenants[3], vehicleTypes[0], "Mazda", "3", "VWX234", "XYZ-234", fuelTypes[1], "Orange", false));
            vehicles.Add(new Vehicle(15, tenants[3], vehicleTypes[0], "Kia", "Forte", "STU902", "XYZ-902", fuelTypes[1], "Silver", false));
            vehicles.Add(new Vehicle(16, tenants[3], vehicleTypes[0], "Kia", "Forte", "STU903", "XYZ-903", fuelTypes[1], "Silver", false));
            vehicles.Add(new Vehicle(17, tenants[3], vehicleTypes[0], "Ford", "Fusion", "FUS123", "FUS-123", fuelTypes[1], "Black", false));
            vehicles.Add(new Vehicle(18, tenants[4], vehicleTypes[0], "Subaru", "Impreza", "YZA567", "XYZ-567", fuelTypes[1], "Purple", false));
            vehicles.Add(new Vehicle(19, tenants[4], vehicleTypes[0], "Volkswagen", "Passat", "BCD890", "XYZ-890", fuelTypes[1], "Brown", false));
            vehicles.Add(new Vehicle(20, tenants[4], vehicleTypes[0], "Subaru", "Impreza", "YZA568", "XYZ-568", fuelTypes[1], "Purple", false));
            vehicles.Add(new Vehicle(21, tenants[4], vehicleTypes[0], "Volkswagen", "Passat", "BCD891", "XYZ-891", fuelTypes[1], "Brown", false));
            vehicles.Add(new Vehicle(22, tenants[4], vehicleTypes[0], "Subaru", "Impreza", "YZA569", "XYZ-569", fuelTypes[1], "Purple", false));
            vehicles.Add(new Vehicle(23, tenants[4], vehicleTypes[0], "Toyota", "Corolla", "EFG123", "XYZ-123", fuelTypes[1], "Blue", false));
            vehicles.Add(new Vehicle(24, tenants[5], vehicleTypes[1], "Honda", "Civic", "HLR45", "XYZ-456", fuelTypes[2], "Red", false));
            vehicles.Add(new Vehicle(25, tenants[5], vehicleTypes[1], "Honda", "Civic", "HLR46", "XYZ-457", fuelTypes[2], "Red", false));
            vehicles.Add(new Vehicle(26, tenants[5], vehicleTypes[1], "Toyota", "Corolla", "EFG124", "XYZ-124", fuelTypes[1], "Blue", false));
            vehicles.Add(new Vehicle(27, tenants[6], vehicleTypes[0], "Ford", "Focus", "KLM789", "XYZ-789", fuelTypes[1], "Green", false));
            vehicles.Add(new Vehicle(28, tenants[6], vehicleTypes[0], "Chevrolet", "Malibu", "NOP013", "XYZ-013", fuelTypes[1], "Black", false));
            vehicles.Add(new Vehicle(29, tenants[6], vehicleTypes[0], "Ford", "Focus", "KLM790", "XYZ-790", fuelTypes[1], "Green", false));
            vehicles.Add(new Vehicle(30, tenants[6], vehicleTypes[0], "Ford", "Focus", "KLM791", "XYZ-791", fuelTypes[1], "Green", false));
            vehicles.Add(new Vehicle(31, tenants[7], vehicleTypes[0], "Nissan", "Altima", "QRS345", "XYZ-345", fuelTypes[1], "White", false));
            vehicles.Add(new Vehicle(32, tenants[7], vehicleTypes[1], "Hyundai", "Elantra", "TUV678", "XYZ-678", fuelTypes[2], "Yellow", false));
            vehicles.Add(new Vehicle(33, tenants[7], vehicleTypes[1], "Hyundai", "Elantra", "TUV679", "XYZ-679", fuelTypes[2], "Yellow", false));
            vehicles.Add(new Vehicle(34, tenants[7], vehicleTypes[0], "Nissan", "Altima", "QRS347", "XYZ-347", fuelTypes[1], "White", false));

            foreach (Vehicle vehicle in vehicles)
            {
                VehicleOpslaanInDb(vehicle, connectionString);
            }
        }
        public static void TenantOpslaanInDb(Tenant tenant, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT Tenant ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO Tenant (TenantId, CompanyName, VATNumber, IsDeleted)" +
                        $"VALUES (@TenantId, @CompanyName, @VATNumber, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@TenantId", SqlDbType.Int);
                    cmd.Parameters["@TenantId"].Value = tenant.TenantId;

                    cmd.Parameters.Add("@CompanyName", SqlDbType.VarChar);
                    cmd.Parameters["@CompanyName"].Value = tenant.CompanyName;

                    cmd.Parameters.Add("@VATNumber", SqlDbType.VarChar);
                    cmd.Parameters["@VATNumber"].Value = tenant.VATNumber;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT Tenant OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public static void ClearanceOpslaanInDb(Clearance clearance, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT Clearance ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO Clearance (ClearanceId, ClearanceLevel, Description, IsDeleted)" +
                        $"VALUES (@ClearanceId, @ClearanceLevel, @Description, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@ClearanceId", SqlDbType.Int);
                    cmd.Parameters["@ClearanceId"].Value = clearance.ClearanceId;

                    cmd.Parameters.Add("@ClearanceLevel", SqlDbType.Int);
                    cmd.Parameters["@ClearanceLevel"].Value = clearance.Clearancelevel;

                    cmd.Parameters.Add("@Description", SqlDbType.VarChar);
                    cmd.Parameters["@Description"].Value = clearance.Description;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT Clearance OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public static void FuelTypeOpslaanInDb(FuelType fuelType, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT FuelType ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO FuelType (FuelTypeId, FuelTypeName, IsDeleted)" +
                        $"VALUES (@FuelTypeId, @FuelTypeName, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@FuelTypeId", SqlDbType.Int);
                    cmd.Parameters["@FuelTypeId"].Value = fuelType.FuelTypeId;

                    cmd.Parameters.Add("@FuelTypeName", SqlDbType.VarChar);
                    cmd.Parameters["@FuelTypeName"].Value = fuelType.FuelTypeName;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT FuelType OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public static void VehicleTypeOpslaanInDb(VehicleType vehicleType, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT VehicleType ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO VehicleType (VehicleTypeId, TypeName, IsDeleted)" +
                        $"VALUES (@VehicleTypeId, @TypeName, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@VehicleTypeId", SqlDbType.Int);
                    cmd.Parameters["@VehicleTypeId"].Value = vehicleType.VehicleTypeId;

                    cmd.Parameters.Add("@TypeName", SqlDbType.VarChar);
                    cmd.Parameters["@TypeName"].Value = vehicleType.TypeName;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT VehicleType OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public static void UserOpslaanInDb(User user, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT [User] ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO [User] (UserId, TenantId, ClearanceId, UserName, Password, Email, IsDeleted)" +
                        $"VALUES (@UserId, @TenantId, @ClearanceId, @UserName, @Password, @Email, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@UserId", SqlDbType.Int);
                    cmd.Parameters["@UserId"].Value = user.UserId;

                    cmd.Parameters.Add("@TenantId", SqlDbType.Int);
                    cmd.Parameters["@TenantId"].Value = user.Tenant.TenantId;

                    cmd.Parameters.Add("@ClearanceId", SqlDbType.Int);
                    cmd.Parameters["@ClearanceId"].Value = user.Clearance.ClearanceId;

                    cmd.Parameters.Add("@UserName", SqlDbType.VarChar);
                    cmd.Parameters["@UserName"].Value = user.UserName;

                    cmd.Parameters.Add("@Password", SqlDbType.VarChar);
                    cmd.Parameters["@Password"].Value = user.Password;

                    cmd.Parameters.Add("@Email", SqlDbType.VarChar);
                    cmd.Parameters["@Email"].Value = user.Email;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT [User] OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
        public static void VehicleOpslaanInDb(Vehicle vehicle, string connectionString)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    // Enable IDENTITY_INSERT
                    string enableIdentityInsert = "SET IDENTITY_INSERT Vehicle ON";
                    SqlCommand enableCmd = new SqlCommand(enableIdentityInsert, connection);
                    enableCmd.ExecuteNonQuery();

                    string insertSql = $"INSERT INTO Vehicle (VehicleId, TenantId, VehicleTypeId, Brand, Model, LicensePlate, ChassisNumber, FuelTypeId, Color, IsDeleted)" +
                        $"VALUES (@VehicleId, @TenantId, @VehicleTypeId, @Brand, @Model, @LicensePlate, @ChassisNumber, @FuelTypeId, @Color, @IsDeleted);";

                    SqlCommand cmd = new SqlCommand(insertSql, connection);

                    cmd.Parameters.Add("@VehicleId", SqlDbType.Int);
                    cmd.Parameters["@VehicleId"].Value = vehicle.VehicleId;

                    cmd.Parameters.Add("@TenantId", SqlDbType.Int);
                    cmd.Parameters["@TenantId"].Value = vehicle.Tenant.TenantId;

                    cmd.Parameters.Add("@VehicleTypeId", SqlDbType.Int);
                    cmd.Parameters["@VehicleTypeId"].Value = vehicle.VehicleType.VehicleTypeId;

                    cmd.Parameters.Add("@Brand", SqlDbType.VarChar);
                    cmd.Parameters["@Brand"].Value = vehicle.Brand;

                    cmd.Parameters.Add("@Model", SqlDbType.VarChar);
                    cmd.Parameters["@Model"].Value = vehicle.Model;

                    cmd.Parameters.Add("@LicensePlate", SqlDbType.VarChar);
                    cmd.Parameters["@LicensePlate"].Value = vehicle.LicensePlate;

                    cmd.Parameters.Add("@ChassisNumber", SqlDbType.VarChar);
                    cmd.Parameters["@ChassisNumber"].Value = vehicle.ChassisNumber;

                    cmd.Parameters.Add("@FuelTypeId", SqlDbType.Int);
                    cmd.Parameters["@FuelTypeId"].Value = vehicle.Fuel.FuelTypeId;

                    cmd.Parameters.Add("@Color", SqlDbType.VarChar);
                    cmd.Parameters["@Color"].Value = vehicle.Color;

                    cmd.Parameters.Add("@IsDeleted", SqlDbType.Bit);
                    cmd.Parameters["@IsDeleted"].Value = 0;

                    cmd.ExecuteNonQuery();

                    // Disable IDENTITY_INSERT
                    string disableIdentityInsert = "SET IDENTITY_INSERT Vehicle OFF";
                    SqlCommand disableCmd = new SqlCommand(disableIdentityInsert, connection);
                    disableCmd.ExecuteNonQuery();
                }
            }
            catch (SqlException sqlEx)
            {
                string errorMessage = $"Error while saving the event. SQL Error: {sqlEx.Message}, LineNumber: {sqlEx.LineNumber}, ErrorCode: {sqlEx.ErrorCode}";
                Console.WriteLine(errorMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
