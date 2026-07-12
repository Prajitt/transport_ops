const roles = ["Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];
const roleSlugs = {
  "Fleet Manager": "fleet-manager",
  Driver: "driver",
  "Safety Officer": "safety-officer",
  "Financial Analyst": "financial-analyst"
};

const state = {
  token: localStorage.getItem("transitops.token"),
  user: JSON.parse(localStorage.getItem("transitops.user") || "null"),
  data: { vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], analytics: null },
  charts: {}
};

const $ = (selector) => document.querySelector(selector);
const h = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const money = (value) => Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const today = () => new Date().toISOString().slice(0, 10);

function setMessage(text, isError = true) {
  const authMessage = $("#auth-message");
  const toast = $("#toast");
  if (authMessage && !$("#auth-screen").classList.contains("hidden-panel")) {
    authMessage.textContent = text || "";
    authMessage.className = `mt-4 min-h-6 text-sm font-semibold ${isError ? "text-rose-600" : "text-signal"}`;
  }
  if (toast && !$("#app-screen").classList.contains("hidden-panel")) {
    toast.textContent = text || "";
    toast.className = text
      ? `mb-4 rounded-lg border px-4 py-3 text-sm font-bold ${isError ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`
      : "hidden";
    if (text) setTimeout(() => toast.classList.add("hidden"), 4200);
  }
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(path, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed.");
  return payload;
}

function session(payload) {
  state.token = payload.token;
  state.user = payload.user;
  localStorage.setItem("transitops.token", payload.token);
  localStorage.setItem("transitops.user", JSON.stringify(payload.user));
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem("transitops.token");
  localStorage.removeItem("transitops.user");
  renderShell();
}

function formJSON(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function vehicleName(id) {
  const vehicle = state.data.vehicles.find((item) => item.id === id);
  return vehicle ? `${vehicle.regNumber} - ${vehicle.model}` : id;
}

function driverName(id) {
  const driver = state.data.drivers.find((item) => item.id === id);
  return driver ? driver.name : id;
}

function statusBadge(status) {
  const styles = {
    Available: "bg-emerald-100 text-emerald-700",
    "On Trip": "bg-blue-100 text-blue-700",
    "In Shop": "bg-amber-100 text-amber-700",
    Retired: "bg-slate-200 text-slate-700",
    Suspended: "bg-rose-100 text-rose-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-slate-200 text-slate-700",
    Open: "bg-amber-100 text-amber-700",
    Closed: "bg-emerald-100 text-emerald-700"
  };
  return `<span class="badge ${styles[status] || "bg-slate-100 text-slate-700"}">${h(status)}</span>`;
}

function demoButtons(targetId) {
  const target = $(targetId);
  target.innerHTML = roles.map((role) => `
    <button class="btn ${state.user?.role === role ? "btn-primary" : "btn-soft"} text-sm" type="button" data-demo-role="${role}">
      <i class="${roleIcon(role)}"></i><span>${shortRole(role)}</span>
    </button>
  `).join("");
}

function roleIcon(role) {
  return {
    "Fleet Manager": "fa-solid fa-truck-fast",
    Driver: "fa-solid fa-id-badge",
    "Safety Officer": "fa-solid fa-shield-halved",
    "Financial Analyst": "fa-solid fa-chart-line"
  }[role];
}

function shortRole(role) {
  return { "Fleet Manager": "Fleet", Driver: "Driver", "Safety Officer": "Safety", "Financial Analyst": "Finance" }[role];
}

async function switchDemo(role) {
  try {
    const payload = await api(`/api/auth/demo/${roleSlugs[role]}`, { method: "POST" });
    session(payload);
    await bootApp();
    setMessage(`${role} view loaded.`, false);
  } catch (error) {
    setMessage(error.message);
  }
}

function metadataFields(role) {
  const fields = {
    "Fleet Manager": [
      ["department", "Department"],
      ["managementLevel", "Management level"]
    ],
    Driver: [
      ["licenseNumber", "License number"],
      ["licenseCategory", "License category"],
      ["licenseExpiry", "License expiry", "date"],
      ["contactNumber", "Contact number"]
    ],
    "Safety Officer": [
      ["certificationId", "Certification ID"],
      ["safetyInspectorLevel", "Inspector level"]
    ],
    "Financial Analyst": [
      ["officeRegion", "Office region"],
      ["ledgerAccessTier", "Ledger tier"]
    ]
  }[role] || [];

  $("#metadata-fields").innerHTML = fields.map(([name, placeholder, type = "text"]) =>
    `<input class="field" name="${name}" type="${type}" placeholder="${placeholder}">`
  ).join("");
}

async function loadData() {
  const [vehicles, drivers, trips, maintenance, fuel, analytics] = await Promise.all([
    api("/api/vehicles"),
    api("/api/drivers"),
    api("/api/trips"),
    api("/api/maintenance"),
    api("/api/fuel"),
    api("/api/analytics")
  ]);
  state.data = { vehicles, drivers, trips, maintenance, fuel, analytics };
}

async function refresh(message) {
  await loadData();
  renderDashboard();
  if (message) setMessage(message, false);
}

function renderShell() {
  demoButtons("#auth-demo-buttons");
  if (!state.token || !state.user) {
    $("#auth-screen").classList.remove("hidden-panel");
    $("#app-screen").classList.add("hidden-panel");
    return;
  }
  $("#auth-screen").classList.add("hidden-panel");
  $("#app-screen").classList.remove("hidden-panel");
}

async function bootApp() {
  renderShell();
  if (state.token && state.user) {
    await loadData();
    renderDashboard();
  }
}

function renderDashboard() {
  demoButtons("#nav-demo-buttons");
  $("#profile-line").textContent = `${state.user.name} / ${state.user.role}`;
  renderMetrics();
  const renderers = {
    "Fleet Manager": renderFleetManager,
    Driver: renderDriver,
    "Safety Officer": renderSafety,
    "Financial Analyst": renderFinance
  };
  renderers[state.user.role]?.();
}

function renderMetrics() {
  const totals = state.data.analytics?.totals || {};
  $("#metric-panel").innerHTML = [
    ["Vehicles", totals.vehicles, "fa-truck-front", "text-signal"],
    ["Available", totals.availableVehicles, "fa-circle-check", "text-emerald-600"],
    ["Drivers", totals.drivers, "fa-users", "text-steel"],
    ["Active trips", totals.activeTrips, "fa-road", "text-blue-600"],
    ["Profit", money(totals.profit), "fa-sack-dollar", "text-amberline"]
  ].map(([label, value, icon, color]) => `
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-bold text-slate-500">${label}</span>
        <i class="fa-solid ${icon} ${color}"></i>
      </div>
      <p class="mt-1 text-2xl font-extrabold">${h(value)}</p>
    </div>
  `).join("");
}

function renderFleetManager() {
  const activeTripOptions = state.data.trips
    .filter((trip) => trip.status === "On Trip")
    .map((trip) => `<option value="${trip.id}">${h(vehicleName(trip.vehicleId))} to ${h(trip.destination)}</option>`)
    .join("");

  $("#role-view").innerHTML = `
    <section class="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Vehicles</h2>
        <form id="vehicle-form" class="grid gap-3 md:grid-cols-2">
          <input class="field" name="regNumber" placeholder="Registration" required>
          <input class="field" name="model" placeholder="Model" required>
          <input class="field" name="type" placeholder="Type" required>
          <input class="field" name="maxLoad" type="number" placeholder="Max load kg" required>
          <input class="field" name="odometer" type="number" placeholder="Odometer" required>
          <input class="field" name="acquisitionCost" type="number" placeholder="Acquisition cost" required>
          <button class="btn btn-primary md:col-span-2" type="submit"><i class="fa-solid fa-plus"></i> Add vehicle</button>
        </form>
      </div>

      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Drivers</h2>
        <form id="driver-form" class="grid gap-3 md:grid-cols-2">
          <input class="field" name="name" placeholder="Name" required>
          <input class="field" name="licenseNumber" placeholder="License number" required>
          <input class="field" name="licenseCategory" placeholder="Category" required>
          <input class="field" name="licenseExpiry" type="date" required>
          <input class="field" name="safetyScore" type="number" min="0" max="100" placeholder="Safety score">
          <button class="btn btn-primary" type="submit"><i class="fa-solid fa-user-plus"></i> Add driver</button>
        </form>
      </div>
    </section>

    <section class="card p-4">
      <h2 class="mb-3 text-xl font-extrabold">Dispatch</h2>
      <form id="trip-form" class="grid gap-3 md:grid-cols-4">
        <input class="field" name="source" placeholder="Source" required>
        <input class="field" name="destination" placeholder="Destination" required>
        <select class="field" name="vehicleId" required>${state.data.vehicles.map((v) => `<option value="${v.id}">${h(v.regNumber)} / ${h(v.status)}</option>`).join("")}</select>
        <select class="field" name="driverId" required>${state.data.drivers.map((d) => `<option value="${d.id}">${h(d.name)} / ${h(d.status)}</option>`).join("")}</select>
        <input class="field" name="cargoWeight" type="number" placeholder="Cargo kg" required>
        <input class="field" name="distance" type="number" placeholder="Distance km" required>
        <input class="field" name="revenue" type="number" placeholder="Revenue" required>
        <button class="btn btn-primary" type="submit"><i class="fa-solid fa-paper-plane"></i> Dispatch</button>
      </form>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <div class="card p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h2 class="text-xl font-extrabold">Fleet Registry</h2>
          <button class="btn btn-soft" data-export="vehicles" type="button" title="Export CSV"><i class="fa-solid fa-file-csv"></i></button>
        </div>
        ${vehicleTable()}
      </div>
      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Maintenance</h2>
        <form id="maintenance-form" class="mb-4 grid gap-3">
          <select class="field" name="vehicleId" required>${state.data.vehicles.map((v) => `<option value="${v.id}">${h(v.regNumber)} / ${h(v.status)}</option>`).join("")}</select>
          <textarea class="field" name="description" placeholder="Description" required></textarea>
          <input class="field" name="cost" type="number" placeholder="Cost" required>
          <input class="field" name="date" type="date" value="${today()}">
          <button class="btn btn-warn" type="submit"><i class="fa-solid fa-screwdriver-wrench"></i> Open work order</button>
        </form>
        ${maintenanceList()}
      </div>
    </section>

    <section class="card p-4">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-xl font-extrabold">Active Trips</h2>
        <form id="cancel-trip-form" class="flex flex-wrap gap-2">
          <select class="field min-w-64" name="tripId">${activeTripOptions || "<option>No active trips</option>"}</select>
          <button class="btn btn-soft" type="submit"><i class="fa-solid fa-ban"></i> Cancel</button>
        </form>
      </div>
      ${tripTable()}
    </section>
  `;
  bindFleetForms();
}

function renderDriver() {
  const driver = findCurrentDriver();
  const activeTrips = state.data.trips.filter((trip) => trip.status === "On Trip" && (!driver || trip.driverId === driver.id));
  $("#role-view").innerHTML = `
    <section class="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Active Trip</h2>
        ${activeTrips.length ? activeTrips.map(driverTripCard).join("") : `<div class="rounded-lg bg-slate-50 p-5 font-bold text-slate-500">No active assignment.</div>`}
      </div>
      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Fuel Log</h2>
        <form id="fuel-form" class="grid gap-3">
          <select class="field" name="vehicleId" required>${state.data.vehicles.map((v) => `<option value="${v.id}">${h(v.regNumber)}</option>`).join("")}</select>
          <input class="field" name="liters" type="number" placeholder="Liters" required>
          <input class="field" name="cost" type="number" placeholder="Cost" required>
          <input class="field" name="distance" type="number" placeholder="Distance km" required>
          <input class="field" name="date" type="date" value="${today()}">
          <button class="btn btn-primary" type="submit"><i class="fa-solid fa-gas-pump"></i> Save fuel</button>
        </form>
      </div>
    </section>
    <section class="card p-4">
      <h2 class="mb-3 text-xl font-extrabold">Trip Ledger</h2>
      ${tripTable(activeTrips.length ? activeTrips : state.data.trips.filter((trip) => !driver || trip.driverId === driver.id))}
    </section>
  `;
  bindDriverForms();
}

function renderSafety() {
  $("#role-view").innerHTML = `
    <section class="card p-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <h2 class="text-xl font-extrabold">Driver Compliance</h2>
        <button class="btn btn-soft" data-export="drivers" type="button" title="Export CSV"><i class="fa-solid fa-file-csv"></i></button>
      </div>
      <div class="grid gap-3">
        ${state.data.drivers.map((driver) => {
          const expired = new Date(driver.licenseExpiry) < new Date();
          const scoreTone = driver.safetyScore >= 90 ? "text-emerald-600" : driver.safetyScore >= 80 ? "text-amber-600" : "text-rose-600";
          return `
            <form class="driver-status-form grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_150px_170px_120px_auto]" data-id="${driver.id}">
              <div>
                <p class="font-extrabold">${h(driver.name)}</p>
                <p class="text-sm font-semibold ${expired ? "text-rose-600" : "text-slate-500"}">${h(driver.licenseNumber)} / ${h(driver.licenseExpiry)}</p>
              </div>
              <input class="field" name="safetyScore" type="number" min="0" max="100" value="${h(driver.safetyScore)}">
              <select class="field" name="status">
                ${["Available", "On Trip", "Suspended"].map((status) => `<option ${driver.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
              <div class="flex items-center gap-2 font-extrabold ${scoreTone}">${driver.safetyScore}<span class="text-slate-400">/100</span></div>
              <button class="btn btn-primary" type="submit"><i class="fa-solid fa-shield"></i> Update</button>
            </form>
          `;
        }).join("")}
      </div>
    </section>
    <section class="card p-4">
      <h2 class="mb-3 text-xl font-extrabold">Maintenance Exposure</h2>
      ${maintenanceList()}
    </section>
  `;
  bindSafetyForms();
}

function renderFinance() {
  const totals = state.data.analytics.totals;
  $("#role-view").innerHTML = `
    <section class="grid gap-4 md:grid-cols-3">
      <div class="card p-4"><p class="text-sm font-bold text-slate-500">Revenue</p><p class="mt-1 text-3xl font-extrabold">${money(totals.revenue)}</p></div>
      <div class="card p-4"><p class="text-sm font-bold text-slate-500">Expense</p><p class="mt-1 text-3xl font-extrabold">${money(totals.expense)}</p></div>
      <div class="card p-4"><p class="text-sm font-bold text-slate-500">Km per liter</p><p class="mt-1 text-3xl font-extrabold">${h(totals.fuelEfficiency)}</p></div>
    </section>
    <section class="grid gap-4 xl:grid-cols-2">
      <div class="card p-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <h2 class="text-xl font-extrabold">Revenue vs Expense</h2>
          <button class="btn btn-soft" data-export="finance" type="button" title="Export CSV"><i class="fa-solid fa-file-csv"></i></button>
        </div>
        <canvas id="finance-chart" height="210"></canvas>
      </div>
      <div class="card p-4">
        <h2 class="mb-3 text-xl font-extrabold">Fleet Status</h2>
        <canvas id="status-chart" height="210"></canvas>
      </div>
    </section>
    <section class="grid gap-4 xl:grid-cols-2">
      <div class="card p-4"><h2 class="mb-3 text-xl font-extrabold">Trip Revenue</h2>${tripTable(state.data.trips.filter((trip) => trip.status === "Completed"))}</div>
      <div class="card p-4"><h2 class="mb-3 text-xl font-extrabold">Fuel Expense</h2>${fuelTable()}</div>
    </section>
  `;
  renderCharts();
}

function findCurrentDriver() {
  const license = state.user.metadata?.licenseNumber;
  return state.data.drivers.find((driver) => driver.licenseNumber === license || driver.name === state.user.name);
}

function driverTripCard(trip) {
  const vehicle = state.data.vehicles.find((item) => item.id === trip.vehicleId);
  return `
    <div class="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-2xl font-extrabold">${h(trip.source)} to ${h(trip.destination)}</p>
          <p class="text-sm font-bold text-slate-500">${h(vehicleName(trip.vehicleId))} / ${h(trip.distance)} km / ${h(trip.cargoWeight)} kg</p>
        </div>
        ${statusBadge(trip.status)}
      </div>
      <form class="complete-trip-form mt-4 grid gap-3 md:grid-cols-4" data-id="${trip.id}">
        <input class="field" name="finalOdometer" type="number" min="${vehicle ? vehicle.odometer + 1 : 1}" placeholder="Final odometer" required>
        <input class="field" name="fuelLiters" type="number" placeholder="Fuel liters" required>
        <input class="field" name="fuelCost" type="number" placeholder="Fuel cost" required>
        <button class="btn btn-primary" type="submit"><i class="fa-solid fa-flag-checkered"></i> Complete</button>
      </form>
    </div>
  `;
}

function vehicleTable() {
  return `
    <div class="table-wrap">
      <table class="w-full min-w-[760px]">
        <thead><tr><th>Reg</th><th>Model</th><th>Type</th><th>Load</th><th>Odometer</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${state.data.vehicles.map((v) => `
            <tr>
              <td class="font-extrabold">${h(v.regNumber)}</td>
              <td>${h(v.model)}</td>
              <td>${h(v.type)}</td>
              <td>${h(v.maxLoad)} kg</td>
              <td>${Number(v.odometer).toLocaleString()}</td>
              <td>${statusBadge(v.status)}</td>
              <td><button class="btn btn-soft text-sm" data-retire="${v.id}" type="button" title="Retire"><i class="fa-solid fa-box-archive"></i></button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function tripTable(trips = state.data.trips) {
  return `
    <div class="table-wrap">
      <table class="w-full min-w-[760px]">
        <thead><tr><th>Route</th><th>Vehicle</th><th>Driver</th><th>Cargo</th><th>Distance</th><th>Revenue</th><th>Status</th></tr></thead>
        <tbody>
          ${trips.map((trip) => `
            <tr>
              <td class="font-extrabold">${h(trip.source)} to ${h(trip.destination)}</td>
              <td>${h(vehicleName(trip.vehicleId))}</td>
              <td>${h(driverName(trip.driverId))}</td>
              <td>${h(trip.cargoWeight)} kg</td>
              <td>${h(trip.distance)} km</td>
              <td>${money(trip.revenue)}</td>
              <td>${statusBadge(trip.status)}</td>
            </tr>
          `).join("") || `<tr><td colspan="7" class="font-bold text-slate-500">No trips found.</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function maintenanceList() {
  return `
    <div class="grid gap-2">
      ${state.data.maintenance.map((log) => `
        <div class="rounded-lg border border-slate-200 p-3">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-extrabold">${h(vehicleName(log.vehicleId))}</p>
              <p class="text-sm text-slate-600">${h(log.description)}</p>
              <p class="mt-1 text-sm font-bold text-slate-500">${h(log.date)} / ${money(log.cost)}</p>
            </div>
            ${statusBadge(log.status)}
          </div>
          ${log.status === "Open" ? `
            <div class="mt-3 flex gap-2">
              <button class="btn btn-primary text-sm" data-close-maint="${log.id}" type="button"><i class="fa-solid fa-check"></i> Close</button>
              <button class="btn btn-soft text-sm" data-retire-maint="${log.id}" type="button"><i class="fa-solid fa-box-archive"></i></button>
            </div>
          ` : ""}
        </div>
      `).join("") || `<div class="rounded-lg bg-slate-50 p-4 font-bold text-slate-500">No maintenance logs.</div>`}
    </div>
  `;
}

function fuelTable() {
  return `
    <div class="table-wrap">
      <table class="w-full min-w-[560px]">
        <thead><tr><th>Vehicle</th><th>Liters</th><th>Distance</th><th>Cost</th><th>Date</th></tr></thead>
        <tbody>
          ${state.data.fuel.map((log) => `
            <tr>
              <td class="font-extrabold">${h(vehicleName(log.vehicleId))}</td>
              <td>${h(log.liters)}</td>
              <td>${h(log.distance)} km</td>
              <td>${money(log.cost)}</td>
              <td>${h(log.date)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindFleetForms() {
  $("#vehicle-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/vehicles", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      event.target.reset();
      await refresh("Vehicle added.");
    } catch (error) { setMessage(error.message); }
  });

  $("#driver-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/drivers", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      event.target.reset();
      await refresh("Driver added.");
    } catch (error) { setMessage(error.message); }
  });

  $("#trip-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/trips", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      event.target.reset();
      await refresh("Trip dispatched.");
    } catch (error) { setMessage(error.message); }
  });

  $("#maintenance-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/maintenance", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      event.target.reset();
      await refresh("Maintenance opened.");
    } catch (error) { setMessage(error.message); }
  });

  $("#cancel-trip-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const { tripId } = formJSON(event.target);
    if (!tripId || tripId === "No active trips") return;
    try {
      await api(`/api/trips/${tripId}/cancel`, { method: "POST" });
      await refresh("Trip cancelled.");
    } catch (error) { setMessage(error.message); }
  });
}

function bindDriverForms() {
  document.querySelectorAll(".complete-trip-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await api(`/api/trips/${form.dataset.id}/complete`, { method: "POST", body: JSON.stringify(formJSON(form)) });
        await refresh("Trip completed.");
      } catch (error) { setMessage(error.message); }
    });
  });

  $("#fuel-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api("/api/fuel", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      event.target.reset();
      await refresh("Fuel log saved.");
    } catch (error) { setMessage(error.message); }
  });
}

function bindSafetyForms() {
  document.querySelectorAll(".driver-status-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        await api(`/api/drivers/${form.dataset.id}`, { method: "PUT", body: JSON.stringify(formJSON(form)) });
        await refresh("Driver compliance updated.");
      } catch (error) { setMessage(error.message); }
    });
  });
}

function bindGlobalActions() {
  document.body.addEventListener("click", async (event) => {
    const demoButton = event.target.closest("[data-demo-role]");
    if (demoButton) return switchDemo(demoButton.dataset.demoRole);

    const retireButton = event.target.closest("[data-retire]");
    if (retireButton) {
      try {
        await api(`/api/vehicles/${retireButton.dataset.retire}`, { method: "PUT", body: JSON.stringify({ status: "Retired" }) });
        await refresh("Vehicle retired.");
      } catch (error) { setMessage(error.message); }
    }

    const closeButton = event.target.closest("[data-close-maint]");
    if (closeButton) {
      try {
        await api(`/api/maintenance/${closeButton.dataset.closeMaint}/close`, { method: "PUT", body: JSON.stringify({ isRetired: false }) });
        await refresh("Maintenance closed.");
      } catch (error) { setMessage(error.message); }
    }

    const retireMaintButton = event.target.closest("[data-retire-maint]");
    if (retireMaintButton) {
      try {
        await api(`/api/maintenance/${retireMaintButton.dataset.retireMaint}/close`, { method: "PUT", body: JSON.stringify({ isRetired: true }) });
        await refresh("Maintenance closed and vehicle retired.");
      } catch (error) { setMessage(error.message); }
    }

    const exportButton = event.target.closest("[data-export]");
    if (exportButton) exportCSV(exportButton.dataset.export);
  });
}

function renderCharts() {
  Object.values(state.charts).forEach((chart) => chart.destroy());
  const finance = state.data.analytics.monthlyFinance;
  state.charts.finance = new Chart($("#finance-chart"), {
    type: "bar",
    data: {
      labels: finance.map((item) => item.label),
      datasets: [
        { label: "Revenue", data: finance.map((item) => item.revenue), backgroundColor: "#0f9f8f", borderRadius: 8 },
        { label: "Expense", data: finance.map((item) => item.expense), backgroundColor: "#f59e0b", borderRadius: 8 }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } }, scales: { y: { beginAtZero: true } } }
  });

  const status = state.data.analytics.statusBreakdown.vehicles;
  state.charts.status = new Chart($("#status-chart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(status),
      datasets: [{ data: Object.values(status), backgroundColor: ["#0f9f8f", "#2563eb", "#f59e0b", "#64748b"] }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
}

function exportCSV(kind) {
  const rows = {
    vehicles: state.data.vehicles,
    drivers: state.data.drivers,
    finance: [
      { metric: "revenue", value: state.data.analytics.totals.revenue },
      { metric: "expense", value: state.data.analytics.totals.expense },
      { metric: "profit", value: state.data.analytics.totals.profit },
      { metric: "fuelEfficiency", value: state.data.analytics.totals.fuelEfficiency }
    ]
  }[kind] || [];

  const headers = Object.keys(rows[0] || { empty: "" });
  const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const link = document.createElement("a");
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  link.download = `transitops-${kind}.csv`;
  link.click();
}

function bindAuth() {
  $("#show-login").addEventListener("click", () => {
    $("#login-form").classList.remove("hidden-panel");
    $("#signup-form").classList.add("hidden-panel");
    $("#show-login").className = "btn btn-dark py-2";
    $("#show-signup").className = "btn btn-soft py-2";
  });

  $("#show-signup").addEventListener("click", () => {
    $("#login-form").classList.add("hidden-panel");
    $("#signup-form").classList.remove("hidden-panel");
    $("#show-login").className = "btn btn-soft py-2";
    $("#show-signup").className = "btn btn-dark py-2";
  });

  $("#signup-role").addEventListener("change", (event) => metadataFields(event.target.value));
  metadataFields($("#signup-role").value);

  $("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const payload = await api("/api/auth/login", { method: "POST", body: JSON.stringify(formJSON(event.target)) });
      session(payload);
      await bootApp();
    } catch (error) { setMessage(error.message); }
  });

  $("#signup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = formJSON(event.target);
    const metadata = {};
    Array.from($("#metadata-fields").querySelectorAll("input")).forEach((input) => {
      metadata[input.name] = input.value;
      delete data[input.name];
    });
    try {
      const payload = await api("/api/auth/signup", { method: "POST", body: JSON.stringify({ ...data, metadata }) });
      session(payload);
      await bootApp();
    } catch (error) { setMessage(error.message); }
  });

  $("#logout-btn").addEventListener("click", logout);
}

bindAuth();
bindGlobalActions();
bootApp().catch((error) => {
  logout();
  setMessage(error.message);
});
