// API: /api/settings — Organization and system settings
let settings = {
  organization: {
    name: 'TransitOps City Transit Authority',
    shortName: 'TOCTA',
    logo: null,
    address: '1400 Congress Ave, Austin, TX 78701',
    phone: '+1 (512) 880-4000',
    email: 'operations@tocta.gov',
    website: 'https://www.tocta.gov',
    timezone: 'America/Chicago',
    currency: 'USD',
    fiscalYearStart: 'January',
  },
  fleet: {
    defaultServiceIntervalMiles: 5000,
    licenseExpiryAlertDays: 30,
    maintenanceAlertDays: 7,
    maxDriverShiftHours: 10,
    requirePreTripInspection: true,
    requirePostTripInspection: true,
    fuelBudgetMonthly: 8500,
    odometerUnit: 'miles',
    speedUnit: 'mph',
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    licenseExpiryAlerts: true,
    maintenanceDueAlerts: true,
    tripDelayAlerts: true,
    fuelBudgetAlerts: true,
    weeklyReportEmail: true,
    alertRecipients: [
      { name: 'Alex Rivera', email: 'alex.rivera@tocta.gov', role: 'Fleet Manager' },
      { name: 'Susan Park', email: 'susan.park@tocta.gov', role: 'Operations Director' },
    ],
  },
  security: {
    sessionTimeoutMinutes: 60,
    twoFactorAuth: true,
    passwordExpiryDays: 90,
    loginAttempts: 5,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    auditLogEnabled: true,
    dataRetentionDays: 365,
  },
  integrations: {
    gps: { enabled: true, provider: 'Samsara', apiKey: '***masked***', syncInterval: 30 },
    fuel: { enabled: true, provider: 'FleetCards Pro', apiKey: '***masked***', lastSync: '2025-07-12T04:00:00Z' },
    payroll: { enabled: false, provider: null, apiKey: null },
    reporting: { enabled: true, provider: 'Tableau', endpoint: 'https://reports.tocta.gov/api' },
  },
  display: {
    theme: 'light',
    language: 'en-US',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    tableRowsPerPage: 10,
    dashboardRefreshSeconds: 60,
  },
};

export async function GET() {
  return Response.json(settings);
}

export async function PATCH(request) {
  const body = await request.json();
  settings = { ...settings, ...body };
  return Response.json({ success: true, settings });
}
