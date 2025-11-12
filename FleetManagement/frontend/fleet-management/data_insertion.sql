USE [FleetManagerDB]
GO

-- Insert Clearances
INSERT INTO [dbo].[Clearance] (ClearanceId, ClearanceLevel, Description) VALUES 
(1, 1, 'Super Admin'), 
(2, 2, 'Tenant Admin'), 
(3, 3, 'Employee');

-- Insert Tenants (Companies)
INSERT INTO [dbo].[Tenant] (CompanyName, VATNumber, IsDeleted) VALUES 
('HeadCompany', 'VAT123463', 0), 
('Company A', 'VAT123456', 0), 
('Company B', 'VAT123457', 0), 
('Company C', 'VAT123458', 0), 
('Company D', 'VAT123459', 0), 
('Company E', 'VAT123460', 0), 
('Company F', 'VAT123461', 0), 
('Company G', 'VAT123462', 0);

-- Insert Users (Admins and Employees)
INSERT INTO [dbo].[User] (TenantId, UserName, Password, Email, ClearanceId, IsDeleted) VALUES 
(1, 'superadmin', 'root', 'superadmin@example.com', 1, 0), 
(2, 'adminA1', 'root', 'adminA1@example.com', 2, 0), 
(2, 'adminA2', 'root', 'adminA2@example.com', 2, 0), 
(2, 'employeeA1', 'root', 'employeeA1@example.com', 3, 0), 
(2, 'employeeA2', 'root', 'employeeA2@example.com', 3, 0), 
(2, 'employeeA3', 'root', 'employeeA3@example.com', 3, 0), 
(3, 'adminB1', 'root', 'adminB1@example.com', 2, 0), 
(3, 'adminB2', 'root', 'adminB2@example.com', 2, 0), 
(3, 'employeeB1', 'root', 'employeeB1@example.com', 3, 0), 
(3, 'employeeB2', 'root', 'employeeB2@example.com', 3, 0), 
(3, 'employeeB3', 'root', 'employeeB3@example.com', 3, 0), 
(4, 'adminC1', 'root', 'adminC1@example.com', 2, 0), 
(4, 'employeeC1', 'root', 'employeeC1@example.com', 3, 0), 
(4, 'employeeC2', 'root', 'employeeC2@example.com', 3, 0), 
(4, 'employeeC3', 'root', 'employeeC3@example.com', 3, 0), 
(5, 'adminD1', 'root', 'adminD1@example.com', 2, 0), 
(5, 'employeeD1', 'root', 'employeeD1@example.com', 3, 0), 
(5, 'employeeD2', 'root', 'employeeD2@example.com', 3, 0), 
(6, 'adminE1', 'root', 'adminE1@example.com', 2, 0), 
(6, 'employeeE1', 'root', 'employeeE1@example.com', 3, 0), 
(6, 'employeeE2', 'root', 'employeeE2@example.com', 3, 0), 
(6, 'employeeE3', 'root', 'employeeE3@example.com', 3, 0), 
(7, 'adminF1', 'root', 'adminF1@example.com', 2, 0), 
(7, 'employeeF1', 'root', 'employeeF1@example.com', 3, 0), 
(7, 'employeeF2', 'root', 'employeeF2@example.com', 3, 0), 
(8, 'adminG1', 'root', 'adminG1@example.com', 2, 0), 
(8, 'employeeG1', 'root', 'employeeG1@example.com', 3, 0), 
(8, 'employeeG2', 'root', 'employeeG2@example.com', 3, 0);

-- Insert Fuel Types
INSERT INTO [dbo].[FuelType] (FuelTypeId, FuelTypeName, IsDeleted) VALUES 
(1, 'Petrol', 0), 
(2, 'Diesel', 0), 
(3, 'Electric', 0), 
(4, 'Hybrid', 0);

-- Insert Vehicle Types
INSERT INTO [dbo].[VehicleType] (VehicleTypeId, TypeName, IsDeleted) VALUES
(1, 'Sedan', 0),
(2, 'Cabriolet', 0),
(3, 'Stationwagen', 0),
(4, 'Crossover', 0);

-- Insert Vehicles
INSERT INTO [dbo].[Vehicle] (TenantId, VehicleTypeId, Brand, Model, ChassisNumber, LicensePlate, FuelTypeId, Color, IsDeleted) VALUES 
(2, 1, 'Ford', 'Focus', 'GHI789', 'XYZ-789', 1, 'Green', 0),
(2, 1, 'Ford', 'Focus', 'GHI790', 'XYZ-790', 1, 'Green', 0),
(2, 2, 'Chevrolet', 'Malibu', 'JKL012', 'XYZ-012', 2, 'Black', 0),
(2, 2, 'Chevrolet', 'Malibu', 'JKL013', 'XYZ-013', 2, 'Black', 0),
(2, 1, 'Ford', 'Focus', 'GHI791', 'XYZ-791', 1, 'Green', 0),
(2, 3, 'Tesla', 'Model S', 'TES123', 'TES-123', 3, 'Red', 0),
(2, 4, 'Toyota', 'Prius', 'PRI456', 'PRI-456', 4, 'Blue', 0),
(3, 1, 'Nissan', 'Altima', 'MNO345', 'XYZ-345', 1, 'White', 0),
(3, 1, 'Nissan', 'Altima', 'MNO346', 'XYZ-346', 1, 'White', 0),
(3, 2, 'Hyundai', 'Elantra', 'PQR678', 'XYZ-678', 2, 'Yellow', 0),
(3, 2, 'Hyundai', 'Elantra', 'PQR679', 'XYZ-679', 2, 'Yellow', 0),
(3, 1, 'Nissan', 'Altima', 'MNO347', 'XYZ-347', 1, 'White', 0),
(3, 3, 'Nissan', 'Leaf', 'LEA789', 'LEA-789', 3, 'Green', 0),
(4, 1, 'Kia', 'Forte', 'STU901', 'XYZ-901', 1, 'Silver', 0),
(4, 2, 'Mazda', '3', 'VWX234', 'XYZ-234', 2, 'Orange', 0),
(4, 1, 'Kia', 'Forte', 'STU902', 'XYZ-902', 1, 'Silver', 0),
(4, 2, 'Mazda', '3', 'VWX235', 'XYZ-235', 2, 'Orange', 0),
(4, 1, 'Kia', 'Forte', 'STU903', 'XYZ-903', 1, 'Silver', 0),
(4, 4, 'Ford', 'Fusion', 'FUS123', 'FUS-123', 4, 'Black', 0),
(5, 1, 'Subaru', 'Impreza', 'YZA567', 'XYZ-567', 1, 'Purple', 0),
(5, 2, 'Volkswagen', 'Jetta', 'BCD890', 'XYZ-890', 2, 'Brown', 0),
(5, 1, 'Subaru', 'Impreza', 'YZA568', 'XYZ-568', 1, 'Purple', 0),
(5, 2, 'Volkswagen', 'Jetta', 'BCD891', 'XYZ-891', 2, 'Brown', 0),
(5, 1, 'Subaru', 'Impreza', 'YZA569', 'XYZ-569', 1, 'Purple', 0),
(6, 1, 'Toyota', 'Corolla', 'EFG123', 'XYZ-123', 1, 'Blue', 0),
(6, 2, 'Honda', 'Civic', 'HIJ456', 'XYZ-456', 2, 'Red', 0),
(6, 1, 'Toyota', 'Corolla', 'EFG124', 'XYZ-124', 1, 'Blue', 0),
(6, 2, 'Honda', 'Civic', 'HIJ457', 'XYZ-457', 2, 'Red', 0),
(6, 1, 'Toyota', 'Corolla', 'EFG125', 'XYZ-125', 1, 'Blue', 0),
(7, 1, 'Ford', 'Focus', 'KLM789', 'XYZ-789', 1, 'Green', 0),
(7, 2, 'Chevrolet', 'Malibu', 'NOP012', 'XYZ-012', 2, 'Black', 0),
(7, 1, 'Ford', 'Focus', 'KLM790', 'XYZ-790', 1, 'Green', 0),
(7, 2, 'Chevrolet', 'Malibu', 'NOP013', 'XYZ-013', 2, 'Black', 0),
(7, 1, 'Ford', 'Focus', 'KLM791', 'XYZ-791', 1, 'Green', 0),
(8, 1, 'Nissan', 'Altima', 'QRS345', 'XYZ-345', 1, 'White', 0),
(8, 2, 'Hyundai', 'Elantra', 'TUV678', 'XYZ-678', 2, 'Yellow', 0),
(8, 1, 'Nissan', 'Altima', 'QRS346', 'XYZ-346', 1, 'White', 0),
(8, 2, 'Hyundai', 'Elantra', 'TUV679', 'XYZ-679', 2, 'Yellow', 0),
(8, 1, 'Nissan', 'Altima', 'QRS347', 'XYZ-347', 1, 'White', 0); 