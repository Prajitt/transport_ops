// API: /api/maintenance
const maintenanceLogs = [
  { id: 'MNT-0421', vehicle: '#4022', serviceType: 'Brake System Overhaul', category: 'Safety', priority: 'High', status: 'Critical', assignedTo: 'Central Garage', mechanic: 'Tony Alvarez', dueDate: '2025-07-13', completedDate: null, estimatedHours: 6.0, estimatedCost: 1840, actualCost: null, parts: ['ABS Module', 'Brake Pads (Set)', 'Rotor Discs x4'], notes: 'ABS module replacement required. Vehicle pulled from service.' },
  { id: 'MNT-0420', vehicle: '#108', serviceType: 'Oil Change & Filter Replacement', category: 'Routine', priority: 'Medium', status: 'Overdue', assignedTo: 'West Depot Shop', mechanic: 'Ray Santos', dueDate: '2025-07-10', completedDate: null, estimatedHours: 1.5, estimatedCost: 95, actualCost: null, parts: ['5W-30 Synthetic Oil (6qt)', 'Oil Filter'], notes: '450 miles past recommended schedule.' },
  { id: 'MNT-0419', vehicle: '#4030', serviceType: 'Battery System Diagnostic & Repair', category: 'Electrical', priority: 'High', status: 'In Progress', assignedTo: 'EV Specialist - Green Motors', mechanic: 'Lisa Tanaka', dueDate: '2025-07-12', completedDate: null, estimatedHours: 8.0, estimatedCost: 380, actualCost: null, parts: ['Battery Management Module', 'Coolant Flush Kit'], notes: 'Charging efficiency 18% below threshold. Cell balancing required.' },
  { id: 'MNT-0418', vehicle: '#4015', serviceType: 'Tire Rotation & Wheel Alignment', category: 'Routine', priority: 'Low', status: 'Scheduled', assignedTo: 'North Depot Shop', mechanic: 'Carlos Reyes', dueDate: '2025-07-18', completedDate: null, estimatedHours: 2.0, estimatedCost: 220, actualCost: null, parts: ['Wheel Weights (set)', 'Valve Stems x8'], notes: 'Routine rotation at 70k miles. Alignment check included.' },
  { id: 'MNT-0417', vehicle: '#4019', serviceType: 'Annual DOT Safety Inspection', category: 'Compliance', priority: 'Medium', status: 'Scheduled', assignedTo: 'State Certified - TX DOT', mechanic: 'Inspector Rodriguez', dueDate: '2025-07-25', completedDate: null, estimatedHours: 3.0, estimatedCost: 150, actualCost: null, parts: [], notes: 'Annual compliance inspection. Registration renewal dependent.' },
  { id: 'MNT-0416', vehicle: '#105', serviceType: 'AC System Recharge', category: 'HVAC', priority: 'Low', status: 'Completed', assignedTo: 'West Depot Shop', mechanic: 'Ray Santos', dueDate: '2025-07-05', completedDate: '2025-07-04', estimatedHours: 2.0, estimatedCost: 125, actualCost: 118, parts: ['R-134a Refrigerant (2 cans)', 'Compressor O-Ring Kit'], notes: 'Completed 1 day ahead of schedule. System pressure nominal.' },
  { id: 'MNT-0415', vehicle: '#110', serviceType: 'Windshield Chip Repair & Seal', category: 'Body', priority: 'Medium', status: 'Completed', assignedTo: 'Central Garage', mechanic: 'Tony Alvarez', dueDate: '2025-07-03', completedDate: '2025-07-03', estimatedHours: 1.0, estimatedCost: 480, actualCost: 465, parts: ['Windshield Repair Resin Kit', 'UV Lamp'], notes: 'Chip sealed. No full replacement needed.' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filtered = maintenanceLogs;
  if (status && status !== 'all') filtered = filtered.filter(m => m.status.toLowerCase() === status.toLowerCase());
  if (priority && priority !== 'all') filtered = filtered.filter(m => m.priority.toLowerCase() === priority.toLowerCase());

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return Response.json({
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    summary: {
      critical: maintenanceLogs.filter(m => m.status === 'Critical').length,
      overdue: maintenanceLogs.filter(m => m.status === 'Overdue').length,
      inProgress: maintenanceLogs.filter(m => m.status === 'In Progress').length,
      scheduled: maintenanceLogs.filter(m => m.status === 'Scheduled').length,
      completed: maintenanceLogs.filter(m => m.status === 'Completed').length,
      totalEstimatedCost: maintenanceLogs.reduce((a, m) => a + m.estimatedCost, 0),
    }
  });
}

export async function POST(request) {
  const body = await request.json();
  const newLog = {
    id: `MNT-${Math.floor(Math.random() * 1000) + 500}`,
    ...body,
    status: 'Scheduled',
    completedDate: null,
    actualCost: null,
  };
  return Response.json({ success: true, record: newLog }, { status: 201 });
}
