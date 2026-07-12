// API: /api/trips
const trips = [
  { id: 'TRP-9902', vehicle: '#4022', vehicleType: 'Electric Bus', driver: 'Sam Wilson', driverId: 'DRV-001', status: 'In Progress', routeId: 'RT-12', from: 'North Depot', to: 'Downtown Terminal', scheduledDepart: '08:30', scheduledArrive: '09:15', actualDepart: '08:31', actualArrive: null, distanceMi: 18.2, passengers: 32, fare: 1.50, date: '2025-07-12' },
  { id: 'TRP-9901', vehicle: '#108', vehicleType: 'Minivan', driver: 'Elena Cruz', driverId: 'DRV-002', status: 'Dispatched', routeId: 'RT-05', from: 'West Hub', to: 'Suburban Link', scheduledDepart: '08:45', scheduledArrive: '09:30', actualDepart: '08:45', actualArrive: null, distanceMi: 12.8, passengers: 8, fare: 2.00, date: '2025-07-12' },
  { id: 'TRP-9898', vehicle: '#4015', vehicleType: 'Standard Bus', driver: 'Marcus Reed', driverId: 'DRV-003', status: 'In Progress', routeId: 'RT-08', from: 'South Station', to: 'East Pier', scheduledDepart: '07:55', scheduledArrive: '08:50', actualDepart: '07:54', actualArrive: null, distanceMi: 22.1, passengers: 45, fare: 1.50, date: '2025-07-12' },
  { id: 'TRP-9895', vehicle: '#105', vehicleType: 'Minivan', driver: 'Jordan Lee', driverId: 'DRV-004', status: 'Dispatched', routeId: 'RT-03', from: 'Downtown Terminal', to: 'North Depot', scheduledDepart: '09:00', scheduledArrive: '09:45', actualDepart: '09:02', actualArrive: null, distanceMi: 18.2, passengers: 6, fare: 2.00, date: '2025-07-12' },
  { id: 'TRP-9890', vehicle: '#4018', vehicleType: 'Standard Bus', driver: 'David Kim', driverId: 'DRV-007', status: 'Completed', routeId: 'RT-18', from: 'North Depot', to: 'Airport Express', scheduledDepart: '06:00', scheduledArrive: '07:10', actualDepart: '06:00', actualArrive: '07:08', distanceMi: 31.5, passengers: 52, fare: 3.00, date: '2025-07-12' },
  { id: 'TRP-9887', vehicle: '#4022', vehicleType: 'Electric Bus', driver: 'Sam Wilson', driverId: 'DRV-001', status: 'Completed', routeId: 'RT-12', from: 'Downtown Terminal', to: 'North Depot', scheduledDepart: '05:30', scheduledArrive: '06:05', actualDepart: '05:30', actualArrive: '06:04', distanceMi: 18.2, passengers: 14, fare: 1.50, date: '2025-07-12' },
  { id: 'TRP-9882', vehicle: '#110', vehicleType: 'SUV', driver: 'Priya Patel', driverId: 'DRV-008', status: 'Cancelled', routeId: 'RT-01', from: 'City Hall', to: 'Convention Center', scheduledDepart: '10:00', scheduledArrive: null, actualDepart: null, actualArrive: null, distanceMi: 3.5, passengers: 0, fare: 0, cancelReason: 'Vehicle breakdown', date: '2025-07-12' },
  { id: 'TRP-9878', vehicle: '#4025', vehicleType: 'Standard Bus', driver: 'Johnathan Smith', driverId: 'DRV-005', status: 'Completed', routeId: 'RT-22', from: 'East Pier', to: 'University Campus', scheduledDepart: '07:00', scheduledArrive: '07:55', actualDepart: '07:01', actualArrive: '07:53', distanceMi: 14.6, passengers: 61, fare: 1.50, date: '2025-07-12' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const date = searchParams.get('date');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filtered = trips;
  if (status && status !== 'all') {
    filtered = filtered.filter(t => t.status.toLowerCase().replace(' ', '-') === status.toLowerCase());
  }
  if (date) {
    filtered = filtered.filter(t => t.date === date);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return Response.json({
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    summary: {
      total: trips.length,
      active: trips.filter(t => t.status === 'In Progress').length,
      dispatched: trips.filter(t => t.status === 'Dispatched').length,
      completed: trips.filter(t => t.status === 'Completed').length,
      cancelled: trips.filter(t => t.status === 'Cancelled').length,
      totalPassengers: trips.reduce((a, t) => a + t.passengers, 0),
    }
  });
}

export async function POST(request) {
  const body = await request.json();
  const newTrip = {
    id: `TRP-${Math.floor(Math.random() * 1000) + 9000}`,
    ...body,
    status: 'Dispatched',
    date: new Date().toISOString().split('T')[0],
    actualDepart: null,
    actualArrive: null,
  };
  return Response.json({ success: true, trip: newTrip }, { status: 201 });
}
