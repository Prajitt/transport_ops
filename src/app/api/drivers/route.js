// API: /api/drivers
const drivers = [
  { id: 'DRV-001', name: 'Sam Wilson', avatar: 'SW', email: 'sam.wilson@transitops.com', phone: '+1 (555) 201-4832', license: 'CDL Class A', licenseNo: 'TX-A-4821003', status: 'On Duty', vehicle: '#4022', trips: 312, onTimeRate: 96, hireDate: '2019-04-12', shift: 'Morning (06:00–14:00)', licenseExp: '2026-03-15', medicalExp: '2026-09-30', address: '1204 Lakewood Dr, Austin TX 78745', emergencyContact: 'Lisa Wilson +1 (555) 201-9900', violations: 0, rating: 4.8 },
  { id: 'DRV-002', name: 'Elena Cruz', avatar: 'EC', email: 'elena.cruz@transitops.com', phone: '+1 (555) 308-7741', license: 'CDL Class B', licenseNo: 'TX-B-6230141', status: 'On Duty', vehicle: '#108', trips: 278, onTimeRate: 94, hireDate: '2021-08-03', shift: 'Morning (06:00–14:00)', licenseExp: '2026-08-22', medicalExp: '2027-01-15', address: '908 Cypress Creek Rd, Cedar Park TX 78613', emergencyContact: 'Jose Cruz +1 (555) 308-3310', violations: 1, rating: 4.6 },
  { id: 'DRV-003', name: 'Marcus Reed', avatar: 'MR', email: 'marcus.reed@transitops.com', phone: '+1 (555) 412-5590', license: 'CDL Class A + Hazmat', licenseNo: 'TX-AH-2918774', status: 'On Duty', vehicle: '#4015', trips: 445, onTimeRate: 98, hireDate: '2017-11-22', shift: 'Split (07:00–11:00, 15:00–19:00)', licenseExp: '2025-07-15', medicalExp: '2026-04-20', address: '552 Sunset Trail, Round Rock TX 78681', emergencyContact: 'Dana Reed +1 (555) 412-1122', violations: 0, rating: 4.9 },
  { id: 'DRV-004', name: 'Jordan Lee', avatar: 'JL', email: 'jordan.lee@transitops.com', phone: '+1 (555) 519-3320', license: 'CDL Class B', licenseNo: 'TX-B-7710082', status: 'Dispatched', vehicle: '#105', trips: 189, onTimeRate: 91, hireDate: '2022-05-15', shift: 'Afternoon (14:00–22:00)', licenseExp: '2026-11-30', medicalExp: '2027-03-10', address: '3310 Mopac Frontage Rd, Austin TX 78746', emergencyContact: 'Taylor Lee +1 (555) 519-8800', violations: 2, rating: 4.3 },
  { id: 'DRV-005', name: 'Johnathan Smith', avatar: 'JS', email: 'john.smith@transitops.com', phone: '+1 (555) 623-8810', license: 'CDL Class B', licenseNo: 'TX-B-3390221', status: 'Off Duty', vehicle: null, trips: 521, onTimeRate: 93, hireDate: '2016-02-08', shift: 'Morning (06:00–14:00)', licenseExp: '2025-07-18', medicalExp: '2025-12-05', address: '77 Oak Hollow, Austin TX 78703', emergencyContact: 'Sandra Smith +1 (555) 623-4400', violations: 0, rating: 4.7 },
  { id: 'DRV-006', name: 'Maria Garcia', avatar: 'MG', email: 'maria.garcia@transitops.com', phone: '+1 (555) 714-2248', license: 'CDL Class A + Hazmat', licenseNo: 'TX-AH-8844110', status: 'On Leave', vehicle: null, trips: 387, onTimeRate: 97, hireDate: '2018-09-30', shift: 'Morning (06:00–14:00)', licenseExp: '2025-07-29', medicalExp: '2026-06-25', address: '1802 Congress Ave, Austin TX 78701', emergencyContact: 'Miguel Garcia +1 (555) 714-9922', violations: 0, rating: 4.9 },
  { id: 'DRV-007', name: 'David Kim', avatar: 'DK', email: 'david.kim@transitops.com', phone: '+1 (555) 817-6631', license: 'CDL Class A', licenseNo: 'TX-A-5521902', status: 'On Duty', vehicle: '#4018', trips: 203, onTimeRate: 95, hireDate: '2022-01-10', shift: 'Afternoon (14:00–22:00)', licenseExp: '2027-01-10', medicalExp: '2027-05-18', address: '2203 Barton Springs Rd, Austin TX 78704', emergencyContact: 'Sarah Kim +1 (555) 817-0033', violations: 1, rating: 4.5 },
  { id: 'DRV-008', name: 'Priya Patel', avatar: 'PP', email: 'priya.patel@transitops.com', phone: '+1 (555) 921-4470', license: 'CDL Class B', licenseNo: 'TX-B-9902201', status: 'On Duty', vehicle: '#101', trips: 156, onTimeRate: 90, hireDate: '2023-03-22', shift: 'Evening (16:00–00:00)', licenseExp: '2026-06-05', medicalExp: '2026-10-12', address: '410 E 6th St, Austin TX 78701', emergencyContact: 'Anish Patel +1 (555) 921-8800', violations: 0, rating: 4.4 },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let filtered = drivers;
  if (status && status !== 'all') {
    filtered = drivers.filter(d => d.status.toLowerCase().replace(' ', '-') === status.toLowerCase());
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const today = new Date();
  const expiringSoon = drivers.filter(d => {
    const exp = new Date(d.licenseExp);
    return (exp - today) / (1000 * 60 * 60 * 24) < 30;
  });

  return Response.json({
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    summary: {
      total: drivers.length,
      onDuty: drivers.filter(d => d.status === 'On Duty').length,
      dispatched: drivers.filter(d => d.status === 'Dispatched').length,
      offDuty: drivers.filter(d => d.status === 'Off Duty').length,
      onLeave: drivers.filter(d => d.status === 'On Leave').length,
      expiringSoon: expiringSoon.length,
      avgOnTimeRate: Math.round(drivers.reduce((a, d) => a + d.onTimeRate, 0) / drivers.length),
    }
  });
}
