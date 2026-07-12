// API: /api/analytics
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '6m';

  const monthly = [
    { month: 'Jan', onTimeRate: 91, utilization: 78, trips: 412, fuelCost: 8420, avgPassengers: 28 },
    { month: 'Feb', onTimeRate: 89, utilization: 75, trips: 388, fuelCost: 7980, avgPassengers: 26 },
    { month: 'Mar', onTimeRate: 93, utilization: 82, trips: 451, fuelCost: 9240, avgPassengers: 31 },
    { month: 'Apr', onTimeRate: 92, utilization: 80, trips: 438, fuelCost: 8800, avgPassengers: 30 },
    { month: 'May', onTimeRate: 95, utilization: 86, trips: 498, fuelCost: 10200, avgPassengers: 34 },
    { month: 'Jun', onTimeRate: 94, utilization: 84, trips: 476, fuelCost: 9600, avgPassengers: 33 },
  ];

  const topVehicles = [
    { id: '#4022', trips: 134, efficiency: 'Excellent', score: 96, type: 'Electric Bus', avgPassengers: 38 },
    { id: '#4015', trips: 118, efficiency: 'Good', score: 88, type: 'Standard Bus', avgPassengers: 35 },
    { id: '#4018', trips: 112, efficiency: 'Good', score: 85, type: 'Standard Bus', avgPassengers: 32 },
    { id: '#108', trips: 98, efficiency: 'Good', score: 83, type: 'Minivan', avgPassengers: 9 },
    { id: '#105', trips: 87, efficiency: 'Fair', score: 76, type: 'Minivan', avgPassengers: 7 },
  ];

  const topDrivers = [
    { name: 'Marcus Reed', id: 'DRV-003', trips: 445, onTimeRate: 98, score: 98, violations: 0, avgRating: 4.9 },
    { name: 'Sam Wilson', id: 'DRV-001', trips: 312, onTimeRate: 96, score: 95, violations: 0, avgRating: 4.8 },
    { name: 'Maria Garcia', id: 'DRV-006', trips: 387, onTimeRate: 97, score: 94, violations: 0, avgRating: 4.9 },
    { name: 'Elena Cruz', id: 'DRV-002', trips: 278, onTimeRate: 94, score: 91, violations: 1, avgRating: 4.6 },
    { name: 'David Kim', id: 'DRV-007', trips: 203, onTimeRate: 95, score: 90, violations: 1, avgRating: 4.5 },
  ];

  const routePerformance = [
    { routeId: 'RT-12', name: 'North Depot ↔ Downtown', trips: 288, avgOnTime: 97, ridership: 9216, revenue: 13824 },
    { routeId: 'RT-08', name: 'South Station → East Pier', trips: 241, avgOnTime: 94, ridership: 10845, revenue: 16267 },
    { routeId: 'RT-18', name: 'Airport Express', trips: 156, avgOnTime: 98, ridership: 8112, revenue: 24336 },
    { routeId: 'RT-22', name: 'University Campus Circuit', trips: 198, avgOnTime: 91, ridership: 12078, revenue: 18117 },
    { routeId: 'RT-05', name: 'West Hub → Suburban', trips: 134, avgOnTime: 89, ridership: 3082, revenue: 6164 },
  ];

  const fleetStatus = { inTransit: 27, available: 12, maintenance: 3 };

  const summary = {
    avgOnTimeRate: 94,
    avgUtilization: 84,
    totalTripsH1: 2663,
    avgFuelCostPerTrip: 79.25,
    totalRevenue: 398880,
    totalPassengers: 158310,
    emissionsReduced: '4.2 tons CO₂ (vs diesel baseline)',
  };

  return Response.json({ monthly, topVehicles, topDrivers, routePerformance, fleetStatus, summary });
}
