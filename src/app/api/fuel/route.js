// API: /api/fuel
const fuelExpenses = [
  { id: 'EXP-1041', date: '2025-07-11', vehicle: '#4022', driver: 'Sam Wilson', type: 'Electric Charge', quantity: '95 kWh', quantityNum: 95, unit: 'kWh', station: 'Depot Charger A', stationId: 'STA-DC-01', odometer: 42310, amount: 28.40, receiptNo: 'DC-2025-07441' },
  { id: 'EXP-1040', date: '2025-07-11', vehicle: '#4015', driver: 'Marcus Reed', type: 'Diesel', quantity: '58.3L', quantityNum: 58.3, unit: 'L', station: 'Shell - N. Blvd', stationId: 'STA-SH-14', odometer: 98450, amount: 124.80, receiptNo: 'SH-14-884201' },
  { id: 'EXP-1039', date: '2025-07-11', vehicle: '#108', driver: 'Elena Cruz', type: 'Gasoline', quantity: '41.2L', quantityNum: 41.2, unit: 'L', station: 'BP West Hub', stationId: 'STA-BP-07', odometer: 28600, amount: 68.50, receiptNo: 'BP-07-332190' },
  { id: 'EXP-1038', date: '2025-07-10', vehicle: '#4019', driver: 'David Kim', type: 'Diesel', quantity: '64.6L', quantityNum: 64.6, unit: 'L', station: 'Truck Stop I-95', stationId: 'STA-TS-03', odometer: 122300, amount: 138.20, receiptNo: 'TS-03-220441' },
  { id: 'EXP-1037', date: '2025-07-10', vehicle: '#105', driver: 'Jordan Lee', type: 'Gasoline', quantity: '43.5L', quantityNum: 43.5, unit: 'L', station: 'Exxon Downtown', stationId: 'STA-EX-02', odometer: 35100, amount: 72.30, receiptNo: 'EX-02-881002' },
  { id: 'EXP-1036', date: '2025-07-10', vehicle: '#4030', driver: '—', type: 'Electric Charge', quantity: '104 kWh', quantityNum: 104, unit: 'kWh', station: 'Depot Charger B', stationId: 'STA-DC-02', odometer: 18750, amount: 31.20, receiptNo: 'DC-2025-07440' },
  { id: 'EXP-1035', date: '2025-07-09', vehicle: '#4018', driver: 'David Kim', type: 'Diesel', quantity: '54.1L', quantityNum: 54.1, unit: 'L', station: 'Shell - S. Station', stationId: 'STA-SH-22', odometer: 71200, amount: 115.60, receiptNo: 'SH-22-558810' },
  { id: 'EXP-1034', date: '2025-07-09', vehicle: '#101', driver: 'Priya Patel', type: 'Gasoline', quantity: '38.8L', quantityNum: 38.8, unit: 'L', station: 'BP East Hub', stationId: 'STA-BP-09', odometer: 44200, amount: 64.50, receiptNo: 'BP-09-440220' },
  { id: 'EXP-1033', date: '2025-07-08', vehicle: '#4025', driver: 'Johnathan Smith', type: 'Diesel', quantity: '71.2L', quantityNum: 71.2, unit: 'L', station: 'Truck Stop I-95', stationId: 'STA-TS-03', odometer: 56800, amount: 152.40, receiptNo: 'TS-03-220332' },
  { id: 'EXP-1032', date: '2025-07-08', vehicle: '#4022', driver: 'Sam Wilson', type: 'Electric Charge', quantity: '88 kWh', quantityNum: 88, unit: 'kWh', station: 'Depot Charger A', stationId: 'STA-DC-01', odometer: 42215, amount: 26.40, receiptNo: 'DC-2025-07330' },
];

const monthlyTotals = [
  { month: 'Jan', year: 2025, total: 8420, diesel: 4378, gasoline: 2530, electric: 1512 },
  { month: 'Feb', year: 2025, total: 7980, diesel: 4149, gasoline: 2394, electric: 1437 },
  { month: 'Mar', year: 2025, total: 9240, diesel: 4804, gasoline: 2772, electric: 1664 },
  { month: 'Apr', year: 2025, total: 8800, diesel: 4576, gasoline: 2640, electric: 1584 },
  { month: 'May', year: 2025, total: 10200, diesel: 5304, gasoline: 3060, electric: 1836 },
  { month: 'Jun', year: 2025, total: 9600, diesel: 4992, gasoline: 2880, electric: 1728 },
  { month: 'Jul', year: 2025, total: 4200, diesel: 2184, gasoline: 1260, electric: 756 },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filtered = fuelExpenses;
  if (type && type !== 'all') filtered = filtered.filter(e => e.type.toLowerCase().replace(' ', '-') === type.toLowerCase());

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const currentMonth = monthlyTotals[monthlyTotals.length - 1];
  const avgPerTrip = (currentMonth.total / 53).toFixed(2);

  return Response.json({
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    monthly: monthlyTotals,
    summary: {
      currentMonthTotal: currentMonth.total,
      budget: 8500,
      budgetUsed: Math.round((currentMonth.total / 8500) * 100),
      avgCostPerTrip: parseFloat(avgPerTrip),
      dieselPct: Math.round((currentMonth.diesel / currentMonth.total) * 100),
      gasolinePct: Math.round((currentMonth.gasoline / currentMonth.total) * 100),
      electricPct: Math.round((currentMonth.electric / currentMonth.total) * 100),
      electricSavings: 1240,
      avgEfficiency: 8.4,
    }
  });
}

export async function POST(request) {
  const body = await request.json();
  const newExp = {
    id: `EXP-${Math.floor(Math.random() * 1000) + 1100}`,
    ...body,
    date: new Date().toISOString().split('T')[0],
  };
  return Response.json({ success: true, expense: newExp }, { status: 201 });
}
