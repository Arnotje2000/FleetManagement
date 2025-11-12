const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE Tenant (
      TenantId INTEGER PRIMARY KEY,
      CompanyName TEXT NOT NULL,
      VATNumber TEXT NOT NULL,
      IsDeleted INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE Clearance (
      ClearanceId INTEGER PRIMARY KEY,
      ClearanceLevel INTEGER NOT NULL,
      Description TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE User (
      UserId INTEGER PRIMARY KEY,
      TenantId INTEGER NOT NULL,
      UserName TEXT NOT NULL,
      Password TEXT NOT NULL,
      Email TEXT NOT NULL,
      ClearanceId INTEGER NOT NULL,
      IsDeleted INTEGER NOT NULL,
      FOREIGN KEY (TenantId) REFERENCES Tenant(TenantId),
      FOREIGN KEY (ClearanceId) REFERENCES Clearance(ClearanceId)
    )
  `);

  db.run(`
    CREATE TABLE VehicleType (
      VehicleTypeId INTEGER PRIMARY KEY,
      TypeName TEXT NOT NULL,
      IsDeleted INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE FuelType (
      FuelTypeId INTEGER PRIMARY KEY,
      FuelTypeName TEXT NOT NULL,
      IsDeleted INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE Vehicle (
      VehicleId INTEGER PRIMARY KEY,
      TenantId INTEGER NOT NULL,
      VehicleTypeId INTEGER NOT NULL,
      Brand TEXT NOT NULL,
      Model TEXT NOT NULL,
      ChassisNumber TEXT NOT NULL,
      LicensePlate TEXT NOT NULL,
      FuelTypeId INTEGER NOT NULL,
      Color TEXT,
      IsDeleted INTEGER NOT NULL,
      FOREIGN KEY (TenantId) REFERENCES Tenant(TenantId),
      FOREIGN KEY (VehicleTypeId) REFERENCES VehicleType(VehicleTypeId),
      FOREIGN KEY (FuelTypeId) REFERENCES FuelType(FuelTypeId)
    )
  `);

  db.run(`
    CREATE TABLE CustomField (
      CustomFieldId INTEGER PRIMARY KEY,
      TenantId INTEGER NOT NULL,
      ValueTypeId INTEGER NOT NULL,
      FieldName TEXT NOT NULL,
      IsDeleted INTEGER NOT NULL,
      FOREIGN KEY (TenantId) REFERENCES Tenant(TenantId)
    )
  `);

  db.run(`
    CREATE TABLE CustomFieldValue (
      CustomFieldValueId INTEGER PRIMARY KEY,
      VehicleId INTEGER NOT NULL,
      CustomFieldId INTEGER NOT NULL,
      Value TEXT NOT NULL,
      IsDeleted INTEGER NOT NULL,
      FOREIGN KEY (VehicleId) REFERENCES Vehicle(VehicleId),
      FOREIGN KEY (CustomFieldId) REFERENCES CustomField(CustomFieldId)
    )
  `);

  // Insert sample data
  db.serialize(() => {
    // Insert Clearances
    db.run("INSERT INTO Clearance (ClearanceId, ClearanceLevel, Description) VALUES (1, 1, 'Super Admin'), (2, 2, 'Tenant Admin'), (3, 3, 'Employee')");

    // Insert Tenants (Companies)
    db.run("INSERT INTO Tenant (CompanyName, VATNumber, IsDeleted) VALUES " +
      "('HeadCompany', 'VAT123463', 0), " +
      "('Company A', 'VAT123456', 0), " +
      "('Company B', 'VAT123457', 0), " +
      "('Company C', 'VAT123458', 0), " +
      "('Company D', 'VAT123459', 0), " +
      "('Company E', 'VAT123460', 0), " +
      "('Company F', 'VAT123461', 0), " +
      "('Company G', 'VAT123462', 0)");

    // Insert Users (Admins and Employees)
    db.run("INSERT INTO User (UserId, TenantId, UserName, Password, Email, ClearanceId, IsDeleted) VALUES " +
      "(1, 1, 'superadmin', 'root', 'superadmin@example.com', 1, 0), " +
      "(2, 2, 'adminA1', 'root', 'adminA1@example.com', 2, 0), " +
      "(3, 2, 'adminA2', 'root', 'adminA2@example.com', 2, 0), " +
      "(4, 2, 'employeeA1', 'root', 'employeeA1@example.com', 3, 0), " +
      "(5, 2, 'employeeA2', 'root', 'employeeA2@example.com', 3, 0), " +
      "(6, 2, 'employeeA3', 'root', 'employeeA3@example.com', 3, 0), " +
      "(7, 3, 'adminB1', 'root', 'adminB1@example.com', 2, 0), " +
      "(8, 3, 'adminB2', 'root', 'adminB2@example.com', 2, 0), " +
      "(9, 3, 'employeeB1', 'root', 'employeeB1@example.com', 3, 0), " +
      "(10, 3, 'employeeB2', 'root', 'employeeB2@example.com', 3, 0), " +
      "(11, 3, 'employeeB3', 'root', 'employeeB3@example.com', 3, 0), " +
      "(12, 4, 'adminC1', 'root', 'adminC1@example.com', 2, 0), " +
      "(13, 4, 'employeeC1', 'root', 'employeeC1@example.com', 3, 0), " +
      "(14, 4, 'employeeC2', 'root', 'employeeC2@example.com', 3, 0), " +
      "(15, 4, 'employeeC3', 'root', 'employeeC3@example.com', 3, 0), " +
      "(16, 5, 'adminD1', 'root', 'adminD1@example.com', 2, 0), " +
      "(17, 5, 'employeeD1', 'root', 'employeeD1@example.com', 3, 0), " +
      "(18, 5, 'employeeD2', 'root', 'employeeD2@example.com', 3, 0), " +
      "(19, 6, 'adminE1', 'root', 'adminE1@example.com', 2, 0), " +
      "(20, 6, 'employeeE1', 'root', 'employeeE1@example.com', 3, 0), " +
      "(21, 6, 'employeeE2', 'root', 'employeeE2@example.com', 3, 0), " +
      "(22, 6, 'employeeE3', 'root', 'employeeE3@example.com', 3, 0), " +
      "(23, 7, 'adminF1', 'root', 'adminF1@example.com', 2, 0), " +
      "(24, 7, 'employeeF1', 'root', 'employeeF1@example.com', 3, 0), " +
      "(25, 7, 'employeeF2', 'root', 'employeeF2@example.com', 3, 0), " +
      "(26, 8, 'adminG1', 'root', 'adminG1@example.com', 2, 0), " +
      "(27, 8, 'employeeG1', 'root', 'employeeG1@example.com', 3, 0), " +
      "(28, 8, 'employeeG2', 'root', 'employeeG2@example.com', 3, 0)");

    // Insert Fuel Types
    db.run(`
      INSERT INTO FuelType (FuelTypeName, IsDeleted) VALUES
      ('Petrol', 0),
      ('Diesel', 0),
      ('Electric', 0),
      ('Hybrid', 0)
    `);

    // Insert sample vehicles
    db.run(`INSERT INTO Vehicle (TenantId, VehicleTypeId, Brand, Model, ChassisNumber, LicensePlate, FuelTypeId, Color, IsDeleted) VALUES
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
      (8, 1, 'Nissan', 'Altima', 'QRS347', 'XYZ-347', 1, 'White', 0)
    `);

    
  });
});

// Endpoint to get all users
app.get('/users', (req, res) => {
  db.all("SELECT * FROM User WHERE IsDeleted = 0", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// Endpoint to get all vehicles for a specific tenant with fuel type names
app.get('/vehicles', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.all(`
    SELECT 
      Vehicle.VehicleId, 
      Vehicle.TenantId, 
      Vehicle.VehicleTypeId, 
      Vehicle.Brand, 
      Vehicle.Model, 
      Vehicle.ChassisNumber, 
      Vehicle.LicensePlate, 
      Vehicle.Color, 
      FuelType.FuelTypeName
    FROM Vehicle
    JOIN FuelType ON Vehicle.FuelTypeId = FuelType.FuelTypeId
    WHERE Vehicle.IsDeleted = 0 AND Vehicle.TenantId = ?
  `, [tenantId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ vehicles: rows });
  });
});

// Endpoint to get all tenants
app.get('/tenants', (req, res) => {
  db.all("SELECT * FROM Tenant WHERE IsDeleted = 0", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ tenants: rows });
  });
});

// Endpoint to authenticate user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM User WHERE UserName = ? AND Password = ? AND IsDeleted = 0",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        res.json({ success: true, clearanceId: row.ClearanceId, UserId: row.UserId, TenantId: row.TenantId });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// Endpoint to get all admins in the same company as the logged-in admin
app.get('/admins', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.all("SELECT * FROM User WHERE ClearanceId = 2 AND IsDeleted = 0 AND TenantId = ?", [tenantId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ admins: rows });
  });
});

// Endpoint to get all employees in the same company as the logged-in admin
app.get('/employees', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.all("SELECT * FROM User WHERE ClearanceId = 3 AND IsDeleted = 0 AND TenantId = ?", [tenantId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ employees: rows });
  });
});

// Endpoint to get a specific user by username
app.get('/user/:username', (req, res) => {
  const username = req.params.username;
  db.get("SELECT * FROM User WHERE UserName = ? AND IsDeleted = 0", [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

// Endpoint to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  
  db.run("UPDATE User SET IsDeleted = 1 WHERE UserId = ?", [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found or already deleted" });
    }
    res.json({ message: "User successfully deleted" });
  });
});

// Endpoint to get vehicle statistics for a specific tenant
app.get('/vehicleStats', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.get(`
    SELECT 
      COUNT(*) AS totalVehicles
    FROM Vehicle
    WHERE TenantId = ? AND IsDeleted = 0`, [tenantId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Endpoint to get tenant information
app.get('/tenant/:id', (req, res) => {
  const tenantId = req.params.id;

  db.get("SELECT * FROM Tenant WHERE TenantId = ? AND IsDeleted = 0", [tenantId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: "Tenant not found" });
    }
  });
});

// Endpoint to get fuel types
app.get('/fuelTypes', (req, res) => {
  db.all("SELECT * FROM FuelType WHERE IsDeleted = 0", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ fuelTypes: rows });
  });
});

// Endpoint to get employee and admin counts for a specific tenant
app.get('/userCounts', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.get(`
    SELECT 
      (SELECT COUNT(*) FROM User WHERE ClearanceId = 3 AND TenantId = ? AND IsDeleted = 0) AS totalEmployees,
      (SELECT COUNT(*) FROM User WHERE ClearanceId = 2 AND TenantId = ? AND IsDeleted = 0) AS totalAdmins
  `, [tenantId, tenantId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Endpoint to get vehicle counts by fuel type for a specific tenant
app.get('/vehicleFuelStats', (req, res) => {
  const tenantId = req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "TenantId is required" });
  }

  db.all(`
    SELECT 
      FuelType.FuelTypeName, 
      COUNT(Vehicle.VehicleId) AS count
    FROM Vehicle
    JOIN FuelType ON Vehicle.FuelTypeId = FuelType.FuelTypeId
    WHERE Vehicle.TenantId = ? AND Vehicle.IsDeleted = 0
    GROUP BY Vehicle.FuelTypeId
  `, [tenantId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Endpoint to add a new user
app.post('/users', (req, res) => {
  const { companyName, contactEmail, employeeName, employeeEmail, employeePassword, companyCode } = req.body;

  // Validate input
  if (!employeeName || !employeeEmail || !employeePassword) {
    return res.status(400).json({ error: "Employee name, email, and password are required" });
  }

  // Insert the new user into the User table
  db.run(
    "INSERT INTO User (UserName, Email, Password, ClearanceId, TenantId, IsDeleted) VALUES (?, ?, ?, ?, ?, 0)",
    [employeeName, employeeEmail, employeePassword, 3, companyCode], // Assuming clearanceId 3 for employees
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ userId: this.lastID, employeeName, employeeEmail });
    }
  );
});

// Endpoint to delete a vehicle by ID
app.delete('/vehicles/:id', (req, res) => {
  const vehicleId = req.params.id;

  db.run("UPDATE Vehicle SET IsDeleted = 1 WHERE VehicleId = ?", [vehicleId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Vehicle not found or already deleted" });
    }
    res.json({ message: "Vehicle successfully deleted" });
  });
});

// Endpoint to add a new custom field
app.post('/customFields', (req, res) => {
  const { tenantId, fieldName, fieldValue } = req.body;

  // Validate input
  if (!fieldName || !tenantId) {
    return res.status(400).json({ error: "FieldName and TenantId are required" });
  }

  // Insert the new custom field into the CustomField table
  db.run("INSERT INTO CustomField (FieldName, ValueTypeId, TenantId, IsDeleted) VALUES (?, ?, ?, 0)", [fieldName, 1, tenantId], function(err) {
    if (err) {
      console.error('Error adding custom field:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    const customFieldId = this.lastID;

    // Log the successful addition of the custom field
    console.log(`Custom field added: ID = ${customFieldId}, Name = ${fieldName}, Tenant ID = ${tenantId}`);

    // Insert a default value into CustomFieldValue for each vehicle associated with the tenant
    db.all("SELECT VehicleId FROM Vehicle WHERE TenantId = ? AND IsDeleted = 0", [tenantId], (err, vehicles) => {
      if (err) {
        console.error('Error fetching vehicles for tenant:', err.message);
        return res.status(500).json({ error: err.message });
      }

      // Insert default value for each vehicle
      const insertPromises = vehicles.map(vehicle => {
        return new Promise((resolve, reject) => {
          db.run("INSERT INTO CustomFieldValue (VehicleId, CustomFieldId, Value, IsDeleted) VALUES (?, ?, ?, 0)", [vehicle.VehicleId, customFieldId, 'No'], function(err) {
            if (err) {
              console.error('Error adding custom field value:', err.message);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      // Wait for all inserts to complete
      Promise.all(insertPromises)
        .then(() => {
          res.json({ CustomFieldId: customFieldId, FieldName: fieldName, Value: 'No' });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    });
  });
});

// Endpoint to get all custom fields
app.get('/customFields', (req, res) => {
  db.all("SELECT * FROM CustomField WHERE IsDeleted = 0", [], (err, rows) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.json(rows);
  });
});

// Endpoint to update a custom field value for a vehicle
app.put('/vehicles/:id/customFields', (req, res) => {
  const vehicleId = req.params.id;
  const { fieldName, value } = req.body;
   db.get("SELECT CustomFieldId FROM CustomField WHERE FieldName = ? AND IsDeleted = 0", [fieldName], (err, row) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (!row) {
          return res.status(404).json({ error: "Custom field not found" });
      }
       const customFieldId = row.CustomFieldId;
       db.run("UPDATE CustomFieldValue SET Value = ? WHERE VehicleId = ? AND CustomFieldId = ? AND IsDeleted = 0", [value, vehicleId, customFieldId], function(err) {
          if (err) {
              return res.status(500).json({ error: err.message });
          }
          if (this.changes === 0) {
              return res.status(404).json({ error: "Custom field value not found or already deleted" });
          }
          res.json({ message: "Custom field updated successfully" });
      });
  });
});

// Endpoint to get vehicles with their custom fields
app.get('/vehiclesWithCustomFields', (req, res) => {
    const tenantId = req.query.tenantId;

    if (!tenantId) {
        return res.status(400).json({ error: "TenantId is required" });
    }

    db.all(`
        SELECT 
            Vehicle.*, 
            CustomField.FieldName, 
            CustomFieldValue.Value 
        FROM Vehicle
        LEFT JOIN CustomFieldValue ON Vehicle.VehicleId = CustomFieldValue.VehicleId AND CustomFieldValue.IsDeleted = 0
        LEFT JOIN CustomField ON CustomFieldValue.CustomFieldId = CustomField.CustomFieldId AND CustomField.IsDeleted = 0
        WHERE Vehicle.TenantId = ? AND Vehicle.IsDeleted = 0
    `, [tenantId], (err, rows) => {
        if (err) {
            console.error('Error fetching vehicles with custom fields:', err.message);
            return res.status(500).json({ error: err.message });
        }

        // Log the retrieved rows
        console.log(`Fetched ${rows.length} vehicles for Tenant ID ${tenantId}:`, rows);

        // Check if custom fields are being retrieved
        const customFields = rows.map(row => ({
            FieldName: row.FieldName,
            Value: row.Value
        }));
        console.log('Custom Fields:', customFields);

        // Transform the data to group custom fields by vehicle
        const vehicles = {};
        rows.forEach(row => {
            if (!vehicles[row.VehicleId]) {
                vehicles[row.VehicleId] = { ...row, customFields: [] };
            }
            if (row.FieldName) {
                vehicles[row.VehicleId].customFields.push({ FieldName: row.FieldName, Value: row.Value });
            }
        });

        res.json({ vehicles: Object.values(vehicles) });
    });
});

// Endpoint to update a vehicle by ID
app.put('/vehicles/:id', (req, res) => {
    const vehicleId = req.params.id;
    const { Brand, Model, LicensePlate, FuelTypeId, Color } = req.body;

    // Prepare the fields to update
    const updatedFields = {};
    if (Brand !== undefined) updatedFields.Brand = Brand;
    if (Model !== undefined) updatedFields.Model = Model;
    if (LicensePlate !== undefined) updatedFields.LicensePlate = LicensePlate;
    if (FuelTypeId !== undefined) updatedFields.FuelTypeId = FuelTypeId;
    if (Color !== undefined) updatedFields.Color = Color;

    // Check if at least one field is provided
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: "At least one field is required to update" });
    }

    // Build the SQL query dynamically based on the fields provided
    const setClause = Object.keys(updatedFields).map((key) => `${key} = ?`).join(', ');
    const values = [...Object.values(updatedFields), vehicleId];

    db.run(`UPDATE Vehicle SET ${setClause} WHERE VehicleId = ? AND IsDeleted = 0`, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Vehicle not found or already deleted" });
        }
        res.json({ message: "Vehicle updated successfully" });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

