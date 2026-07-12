// API: /api/vehicles — Fleet vehicle registry
const vehicles = [
  { id: '#4022', type: 'Electric Bus', make: 'BYD K9', model: 'K9UD', year: 2022, status: 'In-Transit', driver: 'Sam Wilson', driverId: 'DRV-001', mileage: 42310, capacity: 45, fuelType: 'Electric', lastService: '2025-06-01', nextService: '2025-09-01', plate: 'TX-4022-B', vin: '1BAANKCAXTF352210', garage: 'North Depot', insuranceExp: '2026-01-15', registrationExp: '2026-03-20', avgMPG: null, avgMPGe: 3.1 },
  { id: '#4015', type: 'Standard Bus', make: 'Nova Bus', model: 'LFS', year: 2020, status: 'In-Transit', driver: 'Marcus Reed', driverId: 'DRV-003', mileage: 98450, capacity: 40, fuelType: 'Diesel', lastService: '2025-05-15', nextService: '2025-08-15', plate: 'TX-4015-A', vin: '2FRHF8JR9XCA36520', garage: 'South Depot', insuranceExp: '2026-01-15', registrationExp: '2026-02-10', avgMPG: 7.2, avgMPGe: null },
  { id: '#4018', type: 'Standard Bus', make: 'Nova Bus', model: 'LFS', year: 2021, status: 'Available', driver: null, driverId: null, mileage: 71200, capacity: 40, fuelType: 'Diesel', lastService: '2025-06-20', nextService: '2025-09-20', plate: 'TX-4018-A', vin: '2FRHF8JR9XCA40115', garage: 'North Depot', insuranceExp: '2026-01-15', registrationExp: '2026-04-05', avgMPG: 7.6, avgMPGe: null },
  { id: '#108', type: 'Minivan', make: 'Ford', model: 'Transit 350', year: 2023, status: 'In-Transit', driver: 'Elena Cruz', driverId: 'DRV-002', mileage: 28600, capacity: 12, fuelType: 'Gasoline', lastService: '2025-06-25', nextService: '2025-09-25', plate: 'TX-108-V', vin: '1FTBW2CM3PKA03320', garage: 'West Hub', insuranceExp: '2026-01-15', registrationExp: '2026-06-18', avgMPG: 16.4, avgMPGe: null },
  { id: '#105', type: 'Minivan', make: 'Ford', model: 'Transit 350', year: 2022, status: 'Dispatched', driver: 'Jordan Lee', driverId: 'DRV-004', mileage: 35100, capacity: 12, fuelType: 'Gasoline', lastService: '2025-06-10', nextService: '2025-09-10', plate: 'TX-105-V', vin: '1FTBW2CM3PKA01890', garage: 'West Hub', insuranceExp: '2026-01-15', registrationExp: '2026-05-22', avgMPG: 15.8, avgMPGe: null },
  { id: '#4030', type: 'Electric Bus', make: 'BYD', model: 'K9UD', year: 2023, status: 'Maintenance', driver: null, driverId: null, mileage: 18750, capacity: 45, fuelType: 'Electric', lastService: '2025-07-01', nextService: '2025-10-01', plate: 'TX-4030-B', vin: '1BAANKCAXTF401008', garage: 'Central Garage', insuranceExp: '2026-01-15', registrationExp: '2026-08-30', avgMPG: null, avgMPGe: 3.4 },
  { id: '#4019', type: 'Standard Bus', make: 'Gillig', model: 'Advantage', year: 2019, status: 'Available', driver: null, driverId: null, mileage: 122300, capacity: 38, fuelType: 'Diesel', lastService: '2025-05-30', nextService: '2025-08-30', plate: 'TX-4019-C', vin: 'GE1T4TCAX9F209944', garage: 'South Depot', insuranceExp: '2026-01-15', registrationExp: '2025-12-15', avgMPG: 6.8, avgMPGe: null },
  { id: '#110', type: 'SUV', make: 'Chevrolet', model: 'Suburban 4WD', year: 2023, status: 'Available', driver: null, driverId: null, mileage: 12400, capacity: 8, fuelType: 'Gasoline', lastService: '2025-07-05', nextService: '2025-10-05', plate: 'TX-110-S', vin: '1GNSCCKC3PR300122', garage: 'Admin Pool', insuranceExp: '2026-01-15', registrationExp: '2026-09-12', avgMPG: 14.5, avgMPGe: null },
  { id: '#4025', type: 'Standard Bus', make: 'Nova Bus', model: 'LFS Artic', year: 2021, status: 'Available', driver: null, driverId: null, mileage: 56800, capacity: 60, fuelType: 'Diesel', lastService: '2025-06-15', nextService: '2025-09-15', plate: 'TX-4025-D', vin: '2FRHF8JR9XCA44201', garage: 'North Depot', insuranceExp: '2026-01-15', registrationExp: '2026-01-25', avgMPG: 6.4, avgMPGe: null },
  { id: '#101', type: 'Minivan', make: 'Ford', model: 'Transit 250', year: 2021, status: 'In-Transit', driver: 'Priya Patel', driverId: 'DRV-008', mileage: 44200, capacity: 10, fuelType: 'Gasoline', lastService: '2025-06-08', nextService: '2025-09-08', plate: 'TX-101-V', vin: '1FTBR1Y86MKA00801', garage: 'East Hub', insuranceExp: '2026-01-15', registrationExp: '2026-04-30', avgMPG: 17.2, avgMPGe: null },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filtered = vehicles;
  if (status && status !== 'all') {
    filtered = vehicles.filter(v => v.status.toLowerCase() === status.toLowerCase());
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return Response.json({
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    summary: {
      total: vehicles.length,
      inTransit: vehicles.filter(v => v.status === 'In-Transit').length,
      available: vehicles.filter(v => v.status === 'Available').length,
      maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
      dispatched: vehicles.filter(v => v.status === 'Dispatched').length,
    }
  });
}
