// API: /api/support — Support tickets and help center
const tickets = [
  { id: 'TKT-1042', subject: 'GPS tracking not updating for Bus #4015', category: 'Technical', priority: 'High', status: 'Open', submittedBy: 'Alex Rivera', submittedAt: '2025-07-11T14:22:00Z', lastUpdated: '2025-07-11T16:30:00Z', assignedTo: 'Tier 2 Support', messages: 3 },
  { id: 'TKT-1041', subject: 'Driver license renewal upload not working', category: 'Account', priority: 'Medium', status: 'In Progress', submittedBy: 'Sam Wilson', submittedAt: '2025-07-10T09:15:00Z', lastUpdated: '2025-07-11T11:00:00Z', assignedTo: 'Tier 1 Support', messages: 5 },
  { id: 'TKT-1040', subject: 'Monthly fuel report incorrect total for June', category: 'Billing', priority: 'High', status: 'Resolved', submittedBy: 'Susan Park', submittedAt: '2025-07-08T16:40:00Z', lastUpdated: '2025-07-09T13:20:00Z', resolvedAt: '2025-07-09T13:20:00Z', assignedTo: 'Tier 2 Support', messages: 7 },
  { id: 'TKT-1039', subject: 'Request: Add bulk vehicle import via CSV', category: 'Feature Request', priority: 'Low', status: 'Under Review', submittedBy: 'Alex Rivera', submittedAt: '2025-07-07T10:00:00Z', lastUpdated: '2025-07-08T09:00:00Z', assignedTo: 'Product Team', messages: 2 },
  { id: 'TKT-1038', subject: 'Cannot print trip manifest from mobile', category: 'Technical', priority: 'Medium', status: 'Resolved', submittedBy: 'Elena Cruz', submittedAt: '2025-07-05T08:30:00Z', lastUpdated: '2025-07-06T14:00:00Z', resolvedAt: '2025-07-06T14:00:00Z', assignedTo: 'Tier 1 Support', messages: 4 },
];

const faqs = [
  { id: 1, category: 'Fleet', question: 'How do I add a new vehicle to the registry?', answer: 'Navigate to Vehicle Registry → Click "Add Vehicle" → Fill in all required fields including VIN, plate number, and type → Click Save.' },
  { id: 2, category: 'Drivers', question: 'How do I track a driver license expiry?', answer: 'License expiry dates are automatically tracked. You will receive alerts 30 days before expiry via email (configurable in Settings → Notifications).' },
  { id: 3, category: 'Trips', question: 'How do I dispatch a new trip?', answer: 'Go to Trip Management → Click "Create Trip" → Select vehicle, driver, route, and scheduled times → Click Dispatch.' },
  { id: 4, category: 'Reports', question: 'How do I export monthly analytics?', answer: 'Go to Analytics → Select the time period → Click "Export PDF". CSV exports are also available for raw data.' },
  { id: 5, category: 'Fuel', question: 'How do I set a fuel budget alert?', answer: 'Go to Settings → Fleet Configuration → Set your monthly fuel budget. Alerts fire when you reach 80% of budget.' },
  { id: 6, category: 'Security', question: 'How do I enable two-factor authentication?', answer: 'Go to Settings → Security & Access → Toggle "Two-Factor Authentication" → Follow the setup instructions.' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') || 'tickets';

  if (section === 'faqs') {
    return Response.json({ faqs });
  }

  return Response.json({
    tickets,
    summary: {
      open: tickets.filter(t => t.status === 'Open').length,
      inProgress: tickets.filter(t => t.status === 'In Progress').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length,
      underReview: tickets.filter(t => t.status === 'Under Review').length,
    },
    faqs,
    systemStatus: {
      api: { status: 'operational', latency: '42ms' },
      gpsTracking: { status: 'operational', latency: '128ms' },
      notifications: { status: 'operational', latency: '55ms' },
      reporting: { status: 'degraded', latency: '1240ms', note: 'Investigating slow queries' },
      database: { status: 'operational', latency: '18ms' },
    }
  });
}

export async function POST(request) {
  const body = await request.json();
  const newTicket = {
    id: `TKT-${Math.floor(Math.random() * 1000) + 1100}`,
    ...body,
    status: 'Open',
    submittedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    assignedTo: 'Tier 1 Support',
    messages: 0,
  };
  return Response.json({ success: true, ticket: newTicket }, { status: 201 });
}
