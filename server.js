const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'transitops-super-secret-key-12345';
const DB_FILE = process.env.DB_FILE || path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Database
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = getInitialMockData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, using empty schema:", err);
    return { users: [], vehicles: [], drivers: [], trips: [], maintenance_logs: [], fuel_logs: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function issueToken(user) {
  const safeUser = publicUser(user);
  const token = jwt.sign(safeUser, JWT_SECRET, { expiresIn: '24h' });
  return { token, user: safeUser };
}

function getDemoUserByRole(db, role) {
  const normalized = role.replace(/-/g, ' ').toLowerCase();
  return db.users.find(u => u.role.toLowerCase() === normalized);
}

// Helper to pre-populate database
function getInitialMockData() {
  const users = [
    {
      id: "u-1",
      name: "Alex Fleetmaster",
      email: "manager@transitops.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "Fleet Manager",
      metadata: { department: "Logistics Core", managementLevel: "Senior" }
    },
    {
      id: "u-2",
      name: "Marcus Driver",
      email: "driver@transitops.com",
      password: bcrypt.hashSync("driver123", 10),
      role: "Driver",
      metadata: { licenseNumber: "DL-67890", licenseCategory: "Heavy", licenseExpiry: "2027-09-20", contactNumber: "555-0101" }
    },
    {
      id: "u-3",
      name: "Sarah Safety",
      email: "safety@transitops.com",
      password: bcrypt.hashSync("safety123", 10),
      role: "Safety Officer",
      metadata: { certificationId: "CERT-9921", safetyInspectorLevel: "Senior" }
    },
    {
      id: "u-4",
      name: "Ellen Finance",
      email: "finance@transitops.com",
      password: bcrypt.hashSync("finance123", 10),
      role: "Financial Analyst",
      metadata: { officeRegion: "North East HQ", ledgerAccessTier: "Tier 1" }
    }
  ];

  const vehicles = [
    {
      id: "v-1",
      regNumber: "TRK-101",
      model: "Volvo FH16 Globetrotter",
      type: "Heavy Truck",
      maxLoad: 25000, // 25 Tons
      odometer: 120000,
      acquisitionCost: 150000,
      status: "Available"
    },
    {
      id: "v-2",
      regNumber: "TRK-102",
      model: "Scania R500 V8",
      type: "Heavy Truck",
      maxLoad: 24000,
      odometer: 85500,
      acquisitionCost: 140000,
      status: "On Trip"
    },
    {
      id: "v-3",
      regNumber: "VAN-201",
      model: "Ford Transit EcoBlue",
      type: "Light Van",
      maxLoad: 3500, // 3.5 Tons
      odometer: 45200,
      acquisitionCost: 45000,
      status: "In Shop"
    },
    {
      id: "v-4",
      regNumber: "TRK-103",
      model: "Mack Anthem Premium",
      type: "Heavy Truck",
      maxLoad: 26000,
      odometer: 320000,
      acquisitionCost: 165000,
      status: "Retired"
    }
  ];

  const drivers = [
    {
      id: "d-1",
      name: "John Doe",
      licenseNumber: "DL-12345",
      licenseCategory: "Commercial",
      licenseExpiry: "2028-06-15",
      safetyScore: 92,
      status: "Available"
    },
    {
      id: "d-2",
      name: "Marcus Driver", // maps to user driver
      licenseNumber: "DL-67890",
      licenseCategory: "Heavy",
      licenseExpiry: "2027-09-20",
      safetyScore: 96,
      status: "On Trip"
    },
    {
      id: "d-3",
      name: "Bob Johnson",
      licenseNumber: "DL-11111",
      licenseCategory: "Light",
      licenseExpiry: "2026-12-05",
      safetyScore: 78,
      status: "Suspended"
    },
    {
      id: "d-4",
      name: "Alice Brown",
      licenseNumber: "DL-22222",
      licenseCategory: "Commercial",
      licenseExpiry: "2025-05-10", // Expired
      safetyScore: 85,
      status: "Available"
    }
  ];

  const trips = [
    {
      id: "t-1",
      source: "New York Hub",
      destination: "Boston Depot",
      vehicleId: "v-2",
      driverId: "d-2",
      cargoWeight: 18000,
      distance: 350,
      status: "On Trip",
      revenue: 9500
    },
    {
      id: "t-2",
      source: "Chicago Terminal",
      destination: "Detroit Yard",
      vehicleId: "v-1",
      driverId: "d-1",
      cargoWeight: 15000,
      distance: 280,
      status: "Completed",
      revenue: 7500
    }
  ];

  const maintenance_logs = [
    {
      id: "m-1",
      vehicleId: "v-3",
      description: "Engine oil system replacement and brake pad calibration",
      cost: 1200,
      status: "Open",
      date: "2026-07-10"
    },
    {
      id: "m-2",
      vehicleId: "v-1",
      description: "Steering axis alignment and multi-point safety inspection",
      cost: 800,
      status: "Closed",
      date: "2026-06-18"
    }
  ];

  const fuel_logs = [
    {
      id: "f-1",
      vehicleId: "v-1",
      liters: 150,
      cost: 300,
      distance: 450,
      date: "2026-07-01"
    },
    {
      id: "f-2",
      vehicleId: "v-2",
      liters: 180,
      cost: 360,
      distance: 500,
      date: "2026-07-05"
    }
  ];

  return { users, vehicles, drivers, trips, maintenance_logs, fuel_logs };
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, metadata } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Name, email, password, and role are required." });
  }

  const db = readDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered." });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = `u-${Date.now()}`;
  const newUser = { id: userId, name, email, password: hashedPassword, role, metadata: metadata || {} };
  
  db.users.push(newUser);

  // If driver signup, also sync to Drivers collection so they show in operations
  if (role === 'Driver') {
    const driverId = `d-${Date.now()}`;
    const newDriver = {
      id: driverId,
      name,
      licenseNumber: metadata.licenseNumber || "N/A",
      licenseCategory: metadata.licenseCategory || "Commercial",
      licenseExpiry: metadata.licenseExpiry || "",
      safetyScore: 100, // Starts fresh
      status: "Available"
    };
    db.drivers.push(newDriver);
  }

  writeDB(db);

  res.status(201).json(issueToken(newUser));
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const passCorrect = bcrypt.compareSync(password, user.password);
  if (!passCorrect) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  res.json(issueToken(user));
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/demo/:role', (req, res) => {
  const db = readDB();
  const user = getDemoUserByRole(db, req.params.role);
  if (!user) return res.status(404).json({ message: "Demo role not found." });
  res.json(issueToken(user));
});

// ----------------------------------------------------
// VEHICLES ENDPOINTS
// ----------------------------------------------------

app.get('/api/vehicles', (req, res) => {
  const db = readDB();
  res.json(db.vehicles);
});

app.post('/api/vehicles', authenticateToken, (req, res) => {
  const { regNumber, model, type, maxLoad, odometer, acquisitionCost } = req.body;
  if (!regNumber || !model || !type || !maxLoad || !odometer || !acquisitionCost) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const db = readDB();
  // Rule Check: Unique regNumber
  const isDuplicate = db.vehicles.some(v => v.regNumber.toUpperCase() === regNumber.toUpperCase());
  if (isDuplicate) {
    return res.status(400).json({ message: `Vehicle registration number '${regNumber}' is already registered.` });
  }

  const newVehicle = {
    id: `v-${Date.now()}`,
    regNumber: regNumber.toUpperCase(),
    model,
    type,
    maxLoad: parseFloat(maxLoad),
    odometer: parseFloat(odometer),
    acquisitionCost: parseFloat(acquisitionCost),
    status: "Available"
  };

  db.vehicles.push(newVehicle);
  writeDB(db);
  res.status(201).json(newVehicle);
});

app.put('/api/vehicles/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { model, type, maxLoad, odometer, acquisitionCost, status } = req.body;

  const db = readDB();
  const vehicleIdx = db.vehicles.findIndex(v => v.id === id);
  if (vehicleIdx === -1) return res.status(404).json({ message: "Vehicle not found" });

  const vehicle = db.vehicles[vehicleIdx];
  db.vehicles[vehicleIdx] = {
    ...vehicle,
    model: model || vehicle.model,
    type: type || vehicle.type,
    maxLoad: maxLoad !== undefined ? parseFloat(maxLoad) : vehicle.maxLoad,
    odometer: odometer !== undefined ? parseFloat(odometer) : vehicle.odometer,
    acquisitionCost: acquisitionCost !== undefined ? parseFloat(acquisitionCost) : vehicle.acquisitionCost,
    status: status || vehicle.status
  };

  writeDB(db);
  res.json(db.vehicles[vehicleIdx]);
});

app.delete('/api/vehicles/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const initialLen = db.vehicles.length;
  db.vehicles = db.vehicles.filter(v => v.id !== id);
  if (db.vehicles.length === initialLen) return res.status(404).json({ message: "Vehicle not found" });
  writeDB(db);
  res.json({ message: "Vehicle deleted successfully" });
});

// ----------------------------------------------------
// DRIVERS ENDPOINTS
// ----------------------------------------------------

app.get('/api/drivers', (req, res) => {
  const db = readDB();
  res.json(db.drivers);
});

app.post('/api/drivers', authenticateToken, (req, res) => {
  const { name, licenseNumber, licenseCategory, licenseExpiry, safetyScore } = req.body;
  if (!name || !licenseNumber || !licenseCategory || !licenseExpiry) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const db = readDB();
  const newDriver = {
    id: `d-${Date.now()}`,
    name,
    licenseNumber,
    licenseCategory,
    licenseExpiry,
    safetyScore: safetyScore !== undefined ? parseInt(safetyScore) : 100,
    status: "Available"
  };

  db.drivers.push(newDriver);
  writeDB(db);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, licenseNumber, licenseCategory, licenseExpiry, safetyScore, status } = req.body;

  const db = readDB();
  const idx = db.drivers.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ message: "Driver not found" });

  const driver = db.drivers[idx];
  db.drivers[idx] = {
    ...driver,
    name: name || driver.name,
    licenseNumber: licenseNumber || driver.licenseNumber,
    licenseCategory: licenseCategory || driver.licenseCategory,
    licenseExpiry: licenseExpiry || driver.licenseExpiry,
    safetyScore: safetyScore !== undefined ? parseInt(safetyScore) : driver.safetyScore,
    status: status || driver.status
  };

  writeDB(db);
  res.json(db.drivers[idx]);
});

app.delete('/api/drivers/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();
  db.drivers = db.drivers.filter(d => d.id !== id);
  writeDB(db);
  res.json({ message: "Driver removed" });
});

// ----------------------------------------------------
// TRIPS & OPERATIONAL PIPELINE
// ----------------------------------------------------

app.get('/api/trips', (req, res) => {
  const db = readDB();
  res.json(db.trips);
});

// Dispatch Trip
app.post('/api/trips', authenticateToken, (req, res) => {
  const { source, destination, vehicleId, driverId, cargoWeight, distance, revenue } = req.body;
  if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !distance || !revenue) {
    return res.status(400).json({ message: "All trip parameters are required." });
  }

  const db = readDB();

  // Find Vehicle and Driver
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  const driver = db.drivers.find(d => d.id === driverId);

  if (!vehicle) return res.status(400).json({ message: "Assigned vehicle does not exist." });
  if (!driver) return res.status(400).json({ message: "Assigned driver does not exist." });

  // STRICT BUSINESS RULE: Dispatch Filter
  if (vehicle.status === "Retired") {
    return res.status(400).json({ message: "Dispatch Rejected: Selected vehicle is retired." });
  }
  if (vehicle.status === "In Shop") {
    return res.status(400).json({ message: "Dispatch Rejected: Selected vehicle is currently undergoing maintenance (In Shop)." });
  }

  if (driver.status === "Suspended") {
    return res.status(400).json({ message: "Dispatch Rejected: Selected driver has a Suspended status." });
  }

  // Compare License Expiry
  const expiryDate = new Date(driver.licenseExpiry);
  const currentDate = new Date();
  // Set date comparison limits nicely
  if (expiryDate < currentDate) {
    return res.status(400).json({ message: `Dispatch Rejected: Driver license has expired on ${driver.licenseExpiry}.` });
  }

  // STRICT BUSINESS RULE: Availability Guard
  if (vehicle.status === "On Trip") {
    return res.status(400).json({ message: "Dispatch Rejected: Vehicle is currently assigned to another active trip." });
  }
  if (driver.status === "On Trip") {
    return res.status(400).json({ message: "Dispatch Rejected: Driver is currently assigned to another active trip." });
  }

  // STRICT BUSINESS RULE: Capacity Guard
  if (parseFloat(cargoWeight) > parseFloat(vehicle.maxLoad)) {
    return res.status(400).json({ message: `Dispatch Rejected: Cargo weight (${cargoWeight} kg) exceeds vehicle's maximum load capacity (${vehicle.maxLoad} kg).` });
  }

  // STATE AUTOMATION: Switch statuses to 'On Trip'
  vehicle.status = "On Trip";
  driver.status = "On Trip";

  const newTrip = {
    id: `t-${Date.now()}`,
    source,
    destination,
    vehicleId,
    driverId,
    cargoWeight: parseFloat(cargoWeight),
    distance: parseFloat(distance),
    status: "On Trip",
    revenue: parseFloat(revenue)
  };

  db.trips.push(newTrip);
  writeDB(db);

  res.status(201).json(newTrip);
});

// Cancel Trip
app.post('/api/trips/:id/cancel', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const trip = db.trips.find(t => t.id === id);
  if (!trip) return res.status(404).json({ message: "Trip not found." });
  if (trip.status !== "On Trip") {
    return res.status(400).json({ message: "Only active (On Trip) trips can be cancelled." });
  }

  // Find Vehicle and Driver
  const vehicle = db.vehicles.find(v => v.id === trip.vehicleId);
  const driver = db.drivers.find(d => d.id === trip.driverId);

  // STATE AUTOMATION: Revert back to Available
  if (vehicle && vehicle.status === "On Trip") vehicle.status = "Available";
  if (driver && driver.status === "On Trip") driver.status = "Available";

  trip.status = "Cancelled";
  writeDB(db);

  res.json({ message: "Trip cancelled successfully, vehicle and driver released.", trip });
});

// Complete Trip
app.post('/api/trips/:id/complete', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { finalOdometer, fuelLiters, fuelCost } = req.body;

  if (finalOdometer === undefined || fuelLiters === undefined || fuelCost === undefined) {
    return res.status(400).json({ message: "Final odometer, fuel liters, and fuel cost are required to complete trip." });
  }

  const db = readDB();
  const trip = db.trips.find(t => t.id === id);
  if (!trip) return res.status(404).json({ message: "Trip not found." });
  if (trip.status !== "On Trip") {
    return res.status(400).json({ message: "Only active (On Trip) trips can be completed." });
  }

  const vehicle = db.vehicles.find(v => v.id === trip.vehicleId);
  const driver = db.drivers.find(d => d.id === trip.driverId);

  if (!vehicle) return res.status(400).json({ message: "Associated vehicle not found." });

  const finalOdoNum = parseFloat(finalOdometer);
  if (finalOdoNum <= vehicle.odometer) {
    return res.status(400).json({ message: `Invalid odometer. Final odometer (${finalOdoNum}) must be greater than starting odometer (${vehicle.odometer}).` });
  }

  // STATE AUTOMATION:
  // 1. Log fuel
  const distanceCovered = finalOdoNum - vehicle.odometer;
  const newFuelLog = {
    id: `f-${Date.now()}`,
    vehicleId: vehicle.id,
    liters: parseFloat(fuelLiters),
    cost: parseFloat(fuelCost),
    distance: distanceCovered,
    date: new Date().toISOString().split('T')[0]
  };
  db.fuel_logs.push(newFuelLog);

  // 2. Update odometer and vehicle state
  vehicle.odometer = finalOdoNum;
  vehicle.status = "Available";

  // 3. Update driver state
  if (driver) driver.status = "Available";

  // 4. Complete trip
  trip.status = "Completed";
  writeDB(db);

  res.json({ message: "Trip completed successfully. Assets released and fuel logged.", trip });
});

// ----------------------------------------------------
// MAINTENANCE LOGS ENDPOINTS
// ----------------------------------------------------

app.get('/api/maintenance', (req, res) => {
  const db = readDB();
  res.json(db.maintenance_logs);
});

// Open Maintenance
app.post('/api/maintenance', authenticateToken, (req, res) => {
  const { vehicleId, description, cost, date } = req.body;
  if (!vehicleId || !description || !cost) {
    return res.status(400).json({ message: "Vehicle, description, and cost estimates are required." });
  }

  const db = readDB();
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return res.status(400).json({ message: "Vehicle does not exist." });

  // STATE AUTOMATION: Force status to 'In Shop'
  vehicle.status = "In Shop";

  const log = {
    id: `m-${Date.now()}`,
    vehicleId,
    description,
    cost: parseFloat(cost),
    status: "Open",
    date: date || new Date().toISOString().split('T')[0]
  };

  db.maintenance_logs.push(log);
  writeDB(db);
  res.status(201).json(log);
});

// Close Maintenance
app.put('/api/maintenance/:id/close', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { isRetired } = req.body; // boolean flag

  const db = readDB();
  const log = db.maintenance_logs.find(m => m.id === id);
  if (!log) return res.status(404).json({ message: "Maintenance log not found." });

  log.status = "Closed";

  const vehicle = db.vehicles.find(v => v.id === log.vehicleId);
  if (vehicle) {
    // STATE AUTOMATION: Set status back to 'Available' or 'Retired'
    if (isRetired) {
      vehicle.status = "Retired";
    } else {
      vehicle.status = "Available";
    }
  }

  writeDB(db);
  res.json({ message: "Maintenance log closed.", log });
});

// ----------------------------------------------------
// FUEL LOGS ENDPOINTS
// ----------------------------------------------------

app.get('/api/fuel', (req, res) => {
  const db = readDB();
  res.json(db.fuel_logs);
});

app.post('/api/fuel', authenticateToken, (req, res) => {
  const { vehicleId, liters, cost, distance, date } = req.body;
  if (!vehicleId || !liters || !cost || !distance) {
    return res.status(400).json({ message: "Vehicle ID, liters, cost, and distance are required." });
  }

  const db = readDB();
  const vehicle = db.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return res.status(400).json({ message: "Vehicle not found." });

  const log = {
    id: `f-${Date.now()}`,
    vehicleId,
    liters: parseFloat(liters),
    cost: parseFloat(cost),
    distance: parseFloat(distance),
    date: date || new Date().toISOString().split('T')[0]
  };

  db.fuel_logs.push(log);
  writeDB(db);
  res.status(201).json(log);
});

// ----------------------------------------------------
// ANALYTICS ENDPOINT
// ----------------------------------------------------

app.get('/api/analytics', (req, res) => {
  const db = readDB();
  const revenue = db.trips
    .filter(t => t.status === "Completed")
    .reduce((sum, trip) => sum + Number(trip.revenue || 0), 0);
  const fuelExpense = db.fuel_logs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
  const maintenanceExpense = db.maintenance_logs.reduce((sum, log) => sum + Number(log.cost || 0), 0);
  const completedDistance = db.trips
    .filter(t => t.status === "Completed")
    .reduce((sum, trip) => sum + Number(trip.distance || 0), 0);
  const fuelDistance = db.fuel_logs.reduce((sum, log) => sum + Number(log.distance || 0), 0);
  const fuelLiters = db.fuel_logs.reduce((sum, log) => sum + Number(log.liters || 0), 0);

  res.json({
    totals: {
      vehicles: db.vehicles.length,
      availableVehicles: db.vehicles.filter(v => v.status === "Available").length,
      drivers: db.drivers.length,
      activeTrips: db.trips.filter(t => t.status === "On Trip").length,
      revenue,
      expense: fuelExpense + maintenanceExpense,
      profit: revenue - fuelExpense - maintenanceExpense,
      completedDistance,
      fuelEfficiency: fuelLiters ? Number((fuelDistance / fuelLiters).toFixed(2)) : 0
    },
    statusBreakdown: {
      vehicles: db.vehicles.reduce((acc, vehicle) => {
        acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
        return acc;
      }, {}),
      drivers: db.drivers.reduce((acc, driver) => {
        acc[driver.status] = (acc[driver.status] || 0) + 1;
        return acc;
      }, {})
    },
    monthlyFinance: [
      { label: "Fuel", revenue: 0, expense: fuelExpense },
      { label: "Maintenance", revenue: 0, expense: maintenanceExpense },
      { label: "Trips", revenue, expense: 0 }
    ]
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TransitOps server listening on http://localhost:${PORT}`);
  });
}

module.exports = { app, readDB, writeDB, getInitialMockData };
