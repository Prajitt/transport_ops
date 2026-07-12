// API: /api/dashboard — KPI and dashboard summary data
export async function GET() {
  const data = {
    kpi: {
      totalVehicles: 42,
      vehicleTrend: '+2.4%',
      activeTrips: 12,
      driversOnDuty: 18,
      fleetUtilization: 84,
      utilizationLabel: 'Optimized',
    },
    weeklyTrips: [
      { day: 'Mon', trips: 58, completed: 54 },
      { day: 'Tue', trips: 72, completed: 68 },
      { day: 'Wed', trips: 89, completed: 85 },
      { day: 'Thu', trips: 44, completed: 41 },
      { day: 'Fri', trips: 78, completed: 74 },
      { day: 'Sat', trips: 31, completed: 29 },
      { day: 'Sun', trips: 21, completed: 20 },
    ],
    fuelEfficiency: {
      avgMPG: 8.4,
      bestVehicle: '#4022 Electric',
      trend: '+12.3%',
      points: [
        { x: 0, y: 80 }, { x: 100, y: 70 }, { x: 200, y: 40 },
        { x: 300, y: 50 }, { x: 400, y: 20 },
      ],
    },
    alerts: {
      count: 5,
      licenses: [
        { name: 'Johnathan Smith', license: 'CDL Class B', expiresIn: 3, urgent: true },
        { name: 'Maria Garcia', license: 'Hazmat Endorsement', expiresIn: 12, urgent: false },
      ],
      maintenance: [
        { vehicle: 'Bus #4022', issue: 'Brake System Overhaul Required', urgent: true },
        { vehicle: 'Van #108', issue: 'Routine Oil Change - 450 miles overdue', urgent: false },
      ],
    },
    recentTrips: [
      { id: 'TRP-9902', vehicle: '#4022 (Electric)', vehicleIcon: 'directions_bus', driver: 'Sam Wilson', status: 'In Progress', from: 'North Depot', to: 'Downtown Terminal' },
      { id: 'TRP-9901', vehicle: '#108 (Van)', vehicleIcon: 'airport_shuttle', driver: 'Elena Cruz', status: 'Dispatched', from: 'West Hub', to: 'Suburban Link' },
      { id: 'TRP-9898', vehicle: '#4015 (Standard)', vehicleIcon: 'directions_bus', driver: 'Marcus Reed', status: 'In Progress', from: 'South Station', to: 'East Pier' },
      { id: 'TRP-9895', vehicle: '#105 (Van)', vehicleIcon: 'airport_shuttle', driver: 'Jordan Lee', status: 'Dispatched', from: 'Downtown Terminal', to: 'North Depot' },
    ],
  };
  return Response.json(data);
}
