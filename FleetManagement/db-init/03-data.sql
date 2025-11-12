USE [FleetManagerDB]
GO

-- Insert Clearance data
INSERT [dbo].[Clearance] ([ClearanceId], [ClearanceLevel], [Description]) VALUES (1, 1, N'Super Admin')
INSERT [dbo].[Clearance] ([ClearanceId], [ClearanceLevel], [Description]) VALUES (2, 2, N'Tenant Admin')
INSERT [dbo].[Clearance] ([ClearanceId], [ClearanceLevel], [Description]) VALUES (3, 3, N'Employee')
GO

-- Insert Tenant data
SET IDENTITY_INSERT [dbo].[Tenant] ON
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (1, N'HeadCompany', N'VAT123463', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (2, N'Company A', N'VAT123456', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (3, N'Company B', N'VAT123457', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (4, N'Company C', N'VAT123458', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (5, N'Company D', N'VAT123459', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (6, N'Company E', N'VAT123460', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (7, N'Company F', N'VAT123461', 0)
INSERT [dbo].[Tenant] ([TenantId], [CompanyName], [VATNumber], [IsDeleted]) VALUES (8, N'Company G', N'VAT123462', 0)
SET IDENTITY_INSERT [dbo].[Tenant] OFF
GO

-- Insert User data
SET IDENTITY_INSERT [dbo].[User] ON
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (1, 1, N'superadmin', N'BramArno2000!', N'superadmin@example.com', 1, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (2, 2, N'adminA1', N'BramArno2000!', N'adminA1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (3, 2, N'adminA2', N'BramArno2000!', N'adminA2@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (4, 2, N'employeeA1', N'BramArno2000!', N'employeeA1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (5, 2, N'employeeA2', N'BramArno2000!', N'employeeA2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (7, 3, N'adminB1', N'BramArno2000!', N'adminB1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (8, 3, N'adminB2', N'BramArno2000!', N'adminB2@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (9, 3, N'employeeB1', N'BramArno2000!', N'employeeB1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (10, 3, N'employeeB2', N'BramArno2000!', N'employeeB2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (11, 3, N'employeeB3', N'BramArno2000!', N'employeeB3@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (12, 4, N'adminC1', N'BramArno2000!', N'adminC1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (13, 4, N'employeeC1', N'BramArno2000!', N'employeeC1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (14, 4, N'employeeC2', N'BramArno2000!', N'employeeC2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (15, 4, N'employeeC3', N'BramArno2000!', N'employeeC3@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (16, 5, N'adminD1', N'BramArno2000!', N'adminD1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (17, 5, N'employeeD1', N'BramArno2000!', N'employeeD1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (18, 5, N'employeeD2', N'BramArno2000!', N'employeeD2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (19, 6, N'adminE1', N'BramArno2000!', N'adminE1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (20, 6, N'employeeE1', N'BramArno2000!', N'employeeE1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (21, 6, N'employeeE2', N'BramArno2000!', N'employeeE2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (22, 6, N'employeeE3', N'BramArno2000!', N'employeeE3@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (23, 7, N'adminF1', N'BramArno2000!', N'adminF1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (24, 7, N'employeeF1', N'BramArno2000!', N'employeeF1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (25, 7, N'employeeF2', N'BramArno2000!', N'employeeF2@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (26, 8, N'adminG1', N'BramArno2000!', N'adminG1@example.com', 2, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (27, 8, N'employeeG1', N'BramArno2000!', N'employeeG1@example.com', 3, 0)
INSERT [dbo].[User] ([UserId], [TenantId], [UserName], [Password], [Email], [ClearanceId], [IsDeleted]) VALUES (28, 8, N'employeeG2', N'BramArno2000!', N'employeeG2@example.com', 3, 0)
SET IDENTITY_INSERT [dbo].[User] OFF
GO

-- Insert CustomField data
SET IDENTITY_INSERT [dbo].[CustomField] ON
SET IDENTITY_INSERT [dbo].[CustomField] OFF
GO

-- Insert FuelType data
INSERT [dbo].[FuelType] ([FuelTypeId], [FuelTypeName], [IsDeleted]) VALUES (1, N'Petrol', 0)
INSERT [dbo].[FuelType] ([FuelTypeId], [FuelTypeName], [IsDeleted]) VALUES (2, N'Diesel', 0)
INSERT [dbo].[FuelType] ([FuelTypeId], [FuelTypeName], [IsDeleted]) VALUES (3, N'Electric', 0)
INSERT [dbo].[FuelType] ([FuelTypeId], [FuelTypeName], [IsDeleted]) VALUES (4, N'Hybrid', 0)
GO

-- Insert VehicleType data
INSERT [dbo].[VehicleType] ([VehicleTypeId], [TypeName], [isDeleted]) VALUES (1, N'Sedan', 0)
INSERT [dbo].[VehicleType] ([VehicleTypeId], [TypeName], [isDeleted]) VALUES (2, N'Cabriolet', 0)
INSERT [dbo].[VehicleType] ([VehicleTypeId], [TypeName], [isDeleted]) VALUES (3, N'Stationwagen', 0)
INSERT [dbo].[VehicleType] ([VehicleTypeId], [TypeName], [isDeleted]) VALUES (4, N'Crossover', 0)
GO

-- Insert Vehicle data
SET IDENTITY_INSERT [dbo].[Vehicle] ON
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (1, 2, 4, N'Ford', N'Focus', N'GHI783', N'XYZ-780', 2, N'Blue', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (2, 2, 2, N'Ford', N'Focus', N'GHI790', N'XYZ-790', 2, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (3, 2, 2, N'Chevrolet', N'Malibu', N'JKL012', N'XYZ-012', 1, N'Black', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (4, 2, 2, N'Chevrolet', N'Malibu', N'JKL013', N'XYZ-013', 2, N'Black', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (5, 2, 1, N'Ford', N'Focus', N'GHI791', N'XYZ-791', 1, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (6, 2, 3, N'Tesla', N'Model S', N'TES123', N'TES-123', 3, N'Red', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (8, 3, 1, N'Nissan', N'Altima', N'MNO345', N'XYZ-345', 1, N'White', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (9, 3, 1, N'Nissan', N'Altima', N'MNO346', N'XYZ-346', 1, N'White', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (10, 3, 2, N'Hyundai', N'Elantra', N'PQR678', N'XYZ-678', 2, N'Yellow', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (11, 3, 2, N'Hyundai', N'Elantra', N'PQR679', N'XYZ-679', 2, N'Yellow', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (12, 3, 1, N'Nissan', N'Altima', N'MNO347', N'XYZ-347', 1, N'White', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (13, 3, 3, N'Nissan', N'Leaf', N'LEA789', N'LEA-789', 3, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (14, 4, 1, N'Kia', N'Forte', N'STU901', N'XYZ-901', 1, N'Silver', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (15, 4, 2, N'Mazda', N'3', N'VWX234', N'XYZ-234', 2, N'Orange', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (16, 4, 1, N'Kia', N'Forte', N'STU902', N'XYZ-902', 1, N'Silver', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (17, 4, 2, N'Mazda', N'3', N'VWX235', N'XYZ-235', 2, N'Orange', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (18, 4, 1, N'Kia', N'Forte', N'STU903', N'XYZ-903', 1, N'Silver', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (19, 4, 4, N'Ford', N'Fusion', N'FUS123', N'FUS-123', 4, N'Black', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (20, 5, 1, N'Subaru', N'Impreza', N'YZA567', N'XYZ-567', 1, N'Purple', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (21, 5, 2, N'Volkswagen', N'Jetta', N'BCD890', N'XYZ-890', 2, N'Brown', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (22, 5, 1, N'Subaru', N'Impreza', N'YZA568', N'XYZ-568', 1, N'Purple', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (23, 5, 2, N'Volkswagen', N'Jetta', N'BCD891', N'XYZ-891', 2, N'Brown', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (24, 5, 1, N'Subaru', N'Impreza', N'YZA569', N'XYZ-569', 1, N'Purple', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (25, 6, 1, N'Toyota', N'Corolla', N'EFG123', N'XYZ-123', 1, N'Blue', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (26, 6, 2, N'Honda', N'Civic', N'HIJ456', N'XYZ-456', 2, N'Red', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (27, 6, 1, N'Toyota', N'Corolla', N'EFG124', N'XYZ-124', 1, N'Blue', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (28, 6, 2, N'Honda', N'Civic', N'HIJ457', N'XYZ-457', 2, N'Red', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (29, 6, 1, N'Toyota', N'Corolla', N'EFG125', N'XYZ-125', 1, N'Blue', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (30, 7, 1, N'Ford', N'Focus', N'KLM789', N'XYZ-789', 1, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (31, 7, 2, N'Chevrolet', N'Malibu', N'NOP012', N'XYZ-012', 2, N'Black', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (32, 7, 1, N'Ford', N'Focus', N'KLM790', N'XYZ-790', 1, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (33, 7, 2, N'Chevrolet', N'Malibu', N'NOP013', N'XYZ-013', 2, N'Black', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (34, 7, 1, N'Ford', N'Focus', N'KLM791', N'XYZ-791', 1, N'Green', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (35, 8, 1, N'Nissan', N'Altima', N'QRS345', N'XYZ-345', 1, N'White', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (36, 8, 2, N'Hyundai', N'Elantra', N'TUV678', N'XYZ-678', 2, N'Yellow', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (37, 8, 1, N'Nissan', N'Altima', N'QRS346', N'XYZ-346', 1, N'White', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (38, 8, 2, N'Hyundai', N'Elantra', N'TUV679', N'XYZ-679', 2, N'Yellow', 0)
INSERT [dbo].[Vehicle] ([VehicleId], [TenantId], [VehicleTypeId], [Brand], [Model], [ChassisNumber], [LicensePlate], [FuelTypeId], [Color], [IsDeleted]) VALUES (39, 8, 1, N'Nissan', N'Altima', N'QRS347', N'XYZ-347', 1, N'White', 0)
SET IDENTITY_INSERT [dbo].[Vehicle] OFF
GO

-- Insert CustomFieldValue data
SET IDENTITY_INSERT [dbo].[CustomFieldValue] ON
SET IDENTITY_INSERT [dbo].[CustomFieldValue] OFF
GO 