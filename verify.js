const fs = require("fs");
const os = require("os");
const path = require("path");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "transitops-"));
process.env.DB_FILE = path.join(tempDir, "db.json");
process.env.JWT_SECRET = "transitops-test-secret";

const { app } = require("./server");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(baseUrl, route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function run() {
  const server = app.listen(0);
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    const login = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "manager@transitops.com", password: "admin123" })
    });
    assert(login.response.status === 200, "manager login should succeed");
    const auth = { Authorization: `Bearer ${login.payload.token}` };

    const duplicateVehicle = await request(baseUrl, "/api/vehicles", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        regNumber: "TRK-101",
        model: "Duplicate",
        type: "Heavy Truck",
        maxLoad: 10000,
        odometer: 10,
        acquisitionCost: 10
      })
    });
    assert(duplicateVehicle.response.status === 400, "duplicate vehicle registration should be rejected");

    const overloadTrip = await request(baseUrl, "/api/trips", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        source: "Test Hub",
        destination: "Overload Yard",
        vehicleId: "v-1",
        driverId: "d-1",
        cargoWeight: 26000,
        distance: 120,
        revenue: 1800
      })
    });
    assert(overloadTrip.response.status === 400, "over-capacity dispatch should be rejected");

    const inShopTrip = await request(baseUrl, "/api/trips", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        source: "Test Hub",
        destination: "Repair Yard",
        vehicleId: "v-3",
        driverId: "d-1",
        cargoWeight: 2000,
        distance: 80,
        revenue: 1200
      })
    });
    assert(inShopTrip.response.status === 400, "in-shop vehicle dispatch should be rejected");

    const expiredLicenseTrip = await request(baseUrl, "/api/trips", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        source: "Test Hub",
        destination: "Expired License Yard",
        vehicleId: "v-1",
        driverId: "d-4",
        cargoWeight: 1000,
        distance: 80,
        revenue: 1200
      })
    });
    assert(expiredLicenseTrip.response.status === 400, "expired license dispatch should be rejected");

    const validTrip = await request(baseUrl, "/api/trips", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        source: "Test Hub",
        destination: "Clean Yard",
        vehicleId: "v-1",
        driverId: "d-1",
        cargoWeight: 12000,
        distance: 220,
        revenue: 3100
      })
    });
    assert(validTrip.response.status === 201, "valid trip dispatch should succeed");

    const vehiclesAfterDispatch = await request(baseUrl, "/api/vehicles");
    const vehicleOnTrip = vehiclesAfterDispatch.payload.find((vehicle) => vehicle.id === "v-1");
    assert(vehicleOnTrip.status === "On Trip", "dispatch should mark vehicle on trip");

    const cancelTrip = await request(baseUrl, `/api/trips/${validTrip.payload.id}/cancel`, {
      method: "POST",
      headers: auth
    });
    assert(cancelTrip.response.status === 200, "active trip cancel should succeed");

    const driversAfterCancel = await request(baseUrl, "/api/drivers");
    const releasedDriver = driversAfterCancel.payload.find((driver) => driver.id === "d-1");
    assert(releasedDriver.status === "Available", "cancel should release driver");

    const analytics = await request(baseUrl, "/api/analytics");
    assert(analytics.response.status === 200 && analytics.payload.totals, "analytics endpoint should return totals");

    console.log("TransitOps verification passed.");
  } finally {
    server.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
