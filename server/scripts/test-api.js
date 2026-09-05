// ============================================================
// API Test Script
// Run with: node scripts/test-api.js
// Requires the backend server to be running on http://localhost:5000
// ============================================================

const BASE = 'http://localhost:5000';
let passed = 0;
let failed = 0;

async function request(path, options = {}) {
  const res = await fetch(BASE + path, options);
  let body;
  try {
    body = await res.json();
  } catch (e) {
    body = null;
  }
  return { status: res.status, body };
}

function check(name, condition, extra = '') {
  if (condition) {
    passed++;
    console.log(`  PASS ${name}${extra ? ` (${extra})` : ''}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}${extra ? ` (${extra})` : ''}`);
  }
}

function summary() {
  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);
  process.exit(failed > 0 ? 1 : 0);
}

async function run() {
  // ----------------------------------------------------------
  // 1. Health check
  // ----------------------------------------------------------
  console.log('\n--- Health check ---');
  const health = await request('/api/health');
  check('GET /api/health returns running', health.status === 200 && health.body.status === 'Server is running');

  // ----------------------------------------------------------
  // 2. Authentication
  // ----------------------------------------------------------
  console.log('\n--- Authentication ---');

  const badLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  });
  check('Login with wrong password -> 401', badLogin.status === 401);

  const noBodyLogin = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: '', password: '' })
  });
  check('Login with empty fields -> 400', noBodyLogin.status === 400);

  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  check('Login with correct credentials -> 200', login.status === 200 && login.body.success === true);
  const token = login.body?.data?.token;
  check('Login returns a JWT token', !!token, token ? token.slice(0, 20) + '...' : 'no token');

  const verify = await request('/api/auth/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  check('Verify with valid token -> 200', verify.status === 200 && verify.body.success === true);

  const verifyBad = await request('/api/auth/verify', {
    method: 'POST',
    headers: { Authorization: 'Bearer not-a-valid-token' }
  });
  check('Verify with bad token -> 401', verifyBad.status === 401);

  // ----------------------------------------------------------
  // 3. Public routes (no auth)
  // ----------------------------------------------------------
  console.log('\n--- Public car routes ---');

  const cars = await request('/api/cars');
  check('GET /api/cars returns cars', cars.status === 200 && Array.isArray(cars.body.data));
  check('GET /api/cars has seeded cars', (cars.body?.data?.length || 0) === 6, `got ${cars.body?.data?.length}`);

  const filtered = await request('/api/cars?brand=BMW');
  check('GET /api/cars?brand=BMW filters correctly', filtered.status === 200 && filtered.body.data.length === 1 && filtered.body.data[0].brand === 'BMW');

  const range = await request('/api/cars?minPrice=30000&maxPrice=40000');
  check('GET /api/cars price range filter works', range.status === 200 && range.body.data.every((c) => Number(c.price) >= 30000 && Number(c.price) <= 40000), `got ${range.body?.data?.length}`);

  const featured = await request('/api/cars/featured');
  check('GET /api/cars/featured returns only featured', featured.status === 200 && featured.body.data.every((c) => c.featured === true), `got ${featured.body?.data?.length}`);

  const single = await request('/api/cars/1');
  check('GET /api/cars/1 returns car', single.status === 200 && single.body.data.id === 1);

  const missing = await request('/api/cars/999999');
  check('GET /api/cars/999999 -> 404', missing.status === 404);

  console.log('\n--- Public content ---');
  const content = await request('/api/content');
  check('GET /api/content returns content object', content.status === 200 && typeof content.body.data === 'object' && content.body.data.hero_title !== undefined, `hero_title.en="${content.body?.data?.hero_title?.en}"`);
  check('Content includes both languages (en + ar)', content.body?.data?.hero_title?.en && content.body?.data?.hero_title?.ar);

  // ----------------------------------------------------------
  // 4. Admin protection
  // ----------------------------------------------------------
  console.log('\n--- Admin route protection ---');

  const statsNoToken = await request('/api/admin/stats');
  check('GET /api/admin/stats without token -> 401', statsNoToken.status === 401);

  const adminH = { Authorization: `Bearer ${token}` };

  const stats = await request('/api/admin/stats', { headers: adminH });
  check('GET /api/admin/stats with token -> 200', stats.status === 200 && stats.body.success === true, `total_cars=${stats.body?.data?.total_cars}, pending_bookings=${stats.body?.data?.pending_bookings}`);

  // ----------------------------------------------------------
  // 5. Admin car CRUD (including image upload)
  // ----------------------------------------------------------
  console.log('\n--- Admin car CRUD ---');

  const png1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  );

  const createForm = new FormData();
  createForm.append('brand', 'Audi');
  createForm.append('model', 'A4');
  createForm.append('year', '2022');
  createForm.append('price', '32999');
  createForm.append('color', 'Black');
  createForm.append('fuel_type', 'Petrol');
  createForm.append('transmission', 'Automatic');
  createForm.append('mileage', '18000');
  createForm.append('engine', '2.0L TFSI');
  createForm.append('horsepower', '201');
  createForm.append('seats', '5');
  createForm.append('description', 'Test car created by API test.');
  createForm.append('availability', 'true');
  createForm.append('featured', 'false');
  createForm.append('image', new Blob([png1x1], { type: 'image/png' }), 'audi-a4.png');

  const created = await request('/api/admin/cars', {
    method: 'POST',
    headers: adminH,
    body: createForm
  });

  let newCarId = null;
  if (created.status === 201 && created.body.success) {
    newCarId = created.body.data.id;
    check('POST /api/admin/cars creates car with image', true, `id=${newCarId}, image_url="${created.body.data.image_url}"`);
    check('Uploaded image_url is an /uploads path', created.body.data.image_url.startsWith('/uploads/'));
  } else {
    check('POST /api/admin/cars creates car with image', false, JSON.stringify(created.body));
  }

  const badCreateForm = new FormData();
  badCreateForm.append('brand', 'Audi');
  badCreateForm.append('model', 'A4');
  const badCreate = await request('/api/admin/cars', {
    method: 'POST',
    headers: adminH,
    body: badCreateForm
  });
  check('POST /api/admin/cars missing year/price -> 400', badCreate.status === 400);

  if (newCarId) {
    const updateForm = new FormData();
    updateForm.append('price', '30999');
    updateForm.append('availability', 'false');
    const updated = await request(`/api/admin/cars/${newCarId}`, {
      method: 'PUT',
      headers: adminH,
      body: updateForm
    });
    check('PUT /api/admin/cars/:id updates price', updated.status === 200 && Number(updated.body.data.price) === 30999, `price=${updated.body?.data?.price}`);
    check('PUT /api/admin/cars/:id updates availability', updated.body?.data?.availability === false);
  }

  // ----------------------------------------------------------
  // 6. Booking submission (public) & management (admin)
  // ----------------------------------------------------------
  console.log('\n--- Bookings ---');

  const badBooking = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_name: 'X' })
  });
  check('POST /api/bookings missing fields -> 400', badBooking.status === 400);

  const bookingForm = {
    customer_name: 'Test Customer',
    phone_number: '+1 555-999-8888',
    service_type: 'Brake Inspection',
    preferred_date: '2026-10-01',
    preferred_time: '10:30',
    notes: 'Created by test script.',
    car_id: newCarId
  };

  const booking = await request('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingForm)
  });
  let newBookingId = booking.body?.data?.id || null;
  check('POST /api/bookings creates booking -> 201', booking.status === 201 && booking.body.success, `id=${newBookingId}`);
  check('New booking status is pending', booking.body?.data?.status === 'pending');

  const getBookings = await request('/api/admin/bookings', { headers: adminH });
  check('GET /api/admin/bookings returns bookings with car join', getBookings.status === 200 && Array.isArray(getBookings.body.data), `got ${getBookings.body?.data?.length}`);

  if (newBookingId) {
    const updateStatus = await request(`/api/admin/bookings/${newBookingId}`, {
      method: 'PUT',
      headers: { ...adminH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'confirmed' })
    });
    check('PUT /api/admin/bookings/:id updates status -> confirmed', updateStatus.status === 200 && updateStatus.body.data.status === 'confirmed');

    const badStatus = await request(`/api/admin/bookings/${newBookingId}`, {
      method: 'PUT',
      headers: { ...adminH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'not-a-status' })
    });
    check('PUT /api/admin/bookings/:id invalid status -> 400', badStatus.status === 400);
  }

  // ----------------------------------------------------------
  // 7. Content management (admin)
  // ----------------------------------------------------------
  console.log('\n--- Content management ---');

  const updateContent = await request('/api/admin/content/hero_title', {
    method: 'PUT',
    headers: { ...adminH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'Find Your Perfect Car', lang: 'en' })
  });
  check('PUT /api/admin/content/:key updates content', updateContent.status === 200 && updateContent.body.data.section_key === 'hero_title');

  const updateContentAr = await request('/api/admin/content/hero_title', {
    method: 'PUT',
    headers: { ...adminH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'اعثر على سيارتك المثالية', lang: 'ar' })
  });
  check('PUT /api/admin/content/:key updates Arabic row', updateContentAr.status === 200 && updateContentAr.body.data.lang === 'ar');

  const contentAfter = await request('/api/content');
  check('GET /api/content reflects the update', contentAfter.body?.data?.hero_title?.en === 'Find Your Perfect Car' && contentAfter.body?.data?.hero_title?.ar === 'اعثر على سيارتك المثالية');

  // ----------------------------------------------------------
  // 7.5. Branches (public + admin CRUD + activate/deactivate)
  // ----------------------------------------------------------
  console.log('\n--- Branches ---');

  const publicBranches = await request('/api/branches');
  check('GET /api/branches returns active branches', publicBranches.status === 200 && Array.isArray(publicBranches.body.data));
  check('Public branches are all active', publicBranches.body?.data?.every((b) => b.is_active === true));
  check('Public branches includes bilingual fields', publicBranches.body?.data?.[0]?.name_en && publicBranches.body?.data?.[0]?.name_ar);

  const adminBranchesNoToken = await request('/api/admin/branches');
  check('GET /api/admin/branches without token -> 401', adminBranchesNoToken.status === 401);

  const adminBranchesList = await request('/api/admin/branches', { headers: adminH });
  check('GET /api/admin/branches with token -> 200', adminBranchesList.status === 200 && Array.isArray(adminBranchesList.body.data), `got ${adminBranchesList.body?.data?.length}`);

  const branchForm = new FormData();
  branchForm.append('name_en', 'Test Branch EN');
  branchForm.append('name_ar', 'فرع تجريبي عربي');
  branchForm.append('address_en', '99 Test Road');
  branchForm.append('address_ar', 'طريق الاختبار 99');
  branchForm.append('phone', '+1 000 111 2222');
  branchForm.append('email', 'testbranch@modernmotors.com');
  branchForm.append('working_hours_en', '9:00 AM - 5:00 PM');
  branchForm.append('working_hours_ar', '9:00 صباحًا - 5:00 مساءً');
  branchForm.append('is_active', 'true');

  const createdBranch = await request('/api/admin/branches', {
    method: 'POST',
    headers: adminH,
    body: branchForm
  });
  let newBranchId = createdBranch.body?.data?.id || null;
  check('POST /api/admin/branches creates branch -> 201', createdBranch.status === 201 && newBranchId, `id=${newBranchId}`);

  const badBranchForm = new FormData();
  const badBranch = await request('/api/admin/branches', { method: 'POST', headers: adminH, body: badBranchForm });
  check('POST /api/admin/branches missing name -> 400', badBranch.status === 400);

  if (newBranchId) {
    const branchUpdForm = new FormData();
    branchUpdForm.append('phone', '+1 999 000 1111');
    const updatedBranch = await request(`/api/admin/branches/${newBranchId}`, {
      method: 'PUT',
      headers: adminH,
      body: branchUpdForm
    });
    check('PUT /api/admin/branches/:id updates phone', updatedBranch.status === 200 && updatedBranch.body?.data?.phone === '+1 999 000 1111');

    const toggledBranch = await request(`/api/admin/branches/${newBranchId}/active`, { method: 'PATCH', headers: adminH });
    check('PATCH /api/admin/branches/:id/active deactivates', toggledBranch.status === 200 && toggledBranch.body?.data?.is_active === false);

    const publicAfterOff = await request('/api/branches');
    check('Public excludes deactivated branch', publicAfterOff.body?.data?.every((b) => b.id !== newBranchId));

    const reToggle = await request(`/api/admin/branches/${newBranchId}/active`, { method: 'PATCH', headers: adminH });
    check('PATCH re-activates branch', reToggle.status === 200 && reToggle.body?.data?.is_active === true);

    const delBranch = await request(`/api/admin/branches/${newBranchId}`, { method: 'DELETE', headers: adminH });
    check('DELETE /api/admin/branches/:id removes test branch', delBranch.status === 200);
  }

  const adminBranchesAfter = await request('/api/admin/branches', { headers: adminH });
  check('Branch list back to 2 seeded branches', adminBranchesAfter.body?.data?.length === 2, `got ${adminBranchesAfter.body?.data?.length}`);

  // ----------------------------------------------------------
  // 8. 404 handler
  // ----------------------------------------------------------
  console.log('\n--- 404 handling ---');

  const notFound = await request('/api/nonexistent');
  check('Unknown API route -> 404', notFound.status === 404);

  // ----------------------------------------------------------
  // 9. Cleanup (remove created test records)
  // ----------------------------------------------------------
  console.log('\n--- Cleanup ---');

  if (newBookingId) {
    const delBooking = await request(`/api/admin/bookings/${newBookingId}`, { method: 'DELETE', headers: adminH });
    check('DELETE /api/admin/bookings/:id removes test booking', delBooking.status === 200);
  }
  if (newCarId) {
    const delCar = await request(`/api/admin/cars/${newCarId}`, { method: 'DELETE', headers: adminH });
    check('DELETE /api/admin/cars/:id removes test car', delCar.status === 200);
  }

  const finalCars = await request('/api/cars');
  check('Database back to 6 seeded cars', (finalCars.body?.data?.length || 0) === 6, `got ${finalCars.body?.data?.length}`);

  summary();
}

run().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});