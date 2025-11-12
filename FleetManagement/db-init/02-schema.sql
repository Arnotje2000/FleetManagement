USE [FleetManagerDB]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[__EFMigrationsHistory](
    [MigrationId] [nvarchar](150) NOT NULL,
    [ProductVersion] [nvarchar](32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId] ASC)
)
GO

CREATE TABLE [dbo].[Clearance](
    [ClearanceId] [int] NOT NULL,
    [ClearanceLevel] [int] NOT NULL,
    [Description] [varchar](500) NOT NULL,
    CONSTRAINT [PK_Clearance] PRIMARY KEY CLUSTERED ([ClearanceId] ASC)
)
GO

CREATE TABLE [dbo].[FuelType](
    [FuelTypeId] [int] NOT NULL,
    [FuelTypeName] [varchar](500) NOT NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    CONSTRAINT [PK_FuelType] PRIMARY KEY CLUSTERED ([FuelTypeId] ASC)
)
GO

CREATE TABLE [dbo].[VehicleType](
    [VehicleTypeId] [int] NOT NULL,
    [TypeName] [varchar](500) NOT NULL,
    [isDeleted] [bit] NOT NULL DEFAULT(0),
    CONSTRAINT [PK_VehicleType] PRIMARY KEY CLUSTERED ([VehicleTypeId] ASC)
)
GO

CREATE TABLE [dbo].[Tenant](
    [TenantId] [int] IDENTITY(1,1) NOT NULL,
    [CompanyName] [varchar](50) NOT NULL,
    [VATNumber] [varchar](11) NOT NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    CONSTRAINT [PK_Tenant] PRIMARY KEY CLUSTERED ([TenantId] ASC)
)
GO

CREATE TABLE [dbo].[User](
    [UserId] [int] IDENTITY(1,1) NOT NULL,
    [TenantId] [int] NOT NULL,
    [UserName] [varchar](500) NOT NULL,
    [Password] [varchar](500) NOT NULL,
    [Email] [varchar](500) NOT NULL,
    [ClearanceId] [int] NOT NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([UserId] ASC)
)
GO

CREATE TABLE [dbo].[Vehicle](
    [VehicleId] [int] IDENTITY(1,1) NOT NULL,
    [TenantId] [int] NOT NULL,
    [VehicleTypeId] [int] NOT NULL,
    [Brand] [varchar](500) NOT NULL,
    [Model] [varchar](500) NOT NULL,
    [ChassisNumber] [varchar](500) NOT NULL,
    [LicensePlate] [varchar](500) NOT NULL,
    [FuelTypeId] [int] NOT NULL,
    [Color] [varchar](500) NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    CONSTRAINT [PK_Vehicle] PRIMARY KEY CLUSTERED ([VehicleId] ASC)
)
GO

CREATE TABLE [dbo].[CustomField](
    [CustomFieldId] [int] IDENTITY(1,1) NOT NULL,
    [TenantId] [int] NOT NULL,
    [FieldName] [varchar](500) NOT NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    [ValueType] [varchar](50) NOT NULL,
    CONSTRAINT [PK_CustomField] PRIMARY KEY CLUSTERED ([CustomFieldId] ASC)
)
GO

CREATE TABLE [dbo].[CustomFieldValue](
    [CustomFieldValueId] [int] IDENTITY(1,1) NOT NULL,
    [VehicleId] [int] NOT NULL,
    [CustomFieldId] [int] NOT NULL,
    [Value] [sql_variant] NOT NULL,
    [IsDeleted] [bit] NOT NULL DEFAULT(0),
    [ValueType] [nvarchar](50) NOT NULL,
    CONSTRAINT [PK_CustomFieldValue] PRIMARY KEY CLUSTERED ([CustomFieldValueId] ASC)
)
GO

-- Add Foreign Key Constraints
ALTER TABLE [dbo].[CustomField] ADD CONSTRAINT [FK_CustomField_Tenant] 
    FOREIGN KEY([TenantId]) REFERENCES [dbo].[Tenant] ([TenantId])
GO

ALTER TABLE [dbo].[CustomFieldValue] ADD CONSTRAINT [FK_CustomFieldValue_CustomField] 
    FOREIGN KEY([CustomFieldId]) REFERENCES [dbo].[CustomField] ([CustomFieldId])
GO

ALTER TABLE [dbo].[CustomFieldValue] ADD CONSTRAINT [FK_CustomFieldValue_Vehicle] 
    FOREIGN KEY([VehicleId]) REFERENCES [dbo].[Vehicle] ([VehicleId])
GO

ALTER TABLE [dbo].[User] ADD CONSTRAINT [FK_User_Clearance] 
    FOREIGN KEY([ClearanceId]) REFERENCES [dbo].[Clearance] ([ClearanceId])
GO

ALTER TABLE [dbo].[User] ADD CONSTRAINT [FK_User_Tenant] 
    FOREIGN KEY([TenantId]) REFERENCES [dbo].[Tenant] ([TenantId])
GO

ALTER TABLE [dbo].[Vehicle] ADD CONSTRAINT [FK_Vehicle_FuelType] 
    FOREIGN KEY([FuelTypeId]) REFERENCES [dbo].[FuelType] ([FuelTypeId])
GO

ALTER TABLE [dbo].[Vehicle] ADD CONSTRAINT [FK_Vehicle_Tenant] 
    FOREIGN KEY([TenantId]) REFERENCES [dbo].[Tenant] ([TenantId])
GO

ALTER TABLE [dbo].[Vehicle] ADD CONSTRAINT [FK_Vehicle_VehicleType] 
    FOREIGN KEY([VehicleTypeId]) REFERENCES [dbo].[VehicleType] ([VehicleTypeId])
GO 