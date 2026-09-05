// ============================================================
// Database Setup Script
// Creates tables (schema.sql) and inserts bilingual seed data.
// Run from the server folder: node scripts/setup.js
// ============================================================
require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function setup() {
  console.log('=== Starting database setup ===\n');

  try {
    // 1. Read and run the schema (create tables)
    console.log('Creating tables...');
    const schema = fs.readFileSync(__dirname + '/../../database/schema.sql', 'utf-8');
    await pool.query(schema);
    console.log('Tables created successfully.\n');

    // 2. Seed an admin user (password hashed with bcrypt)
    console.log('Seeding admin user...');
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      `INSERT INTO admins (username, password)
       VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING`,
      [adminUsername, hashedPassword]
    );
    console.log(`Admin created: username="${adminUsername}", password="${adminPassword}"\n`);

    // 3. Seed sample cars (English + Arabic descriptions)
    console.log('Seeding sample cars...');
    const cars = [
      {
        brand: 'Toyota', model: 'Corolla', year: 2022, price: 18999, color: 'Silver',
        fuel_type: 'Petrol', transmission: 'Automatic', mileage: 32000, engine: '1.8L',
        horsepower: 139, seats: 5,
        description: 'Reliable and fuel-efficient compact sedan. One owner, full service history.',
        description_ar: 'سيارة سيدان مدمجة موثوقة واقتصادية في استهلاك الوقود. مالك واحد، سجل خدمة كامل.',
        image_url: '', availability: true, featured: true
      },
      {
        brand: 'BMW', model: 'X5', year: 2021, price: 45999, color: 'Black',
        fuel_type: 'Diesel', transmission: 'Automatic', mileage: 41000, engine: '3.0L Twin Turbo',
        horsepower: 335, seats: 5,
        description: 'Luxury SUV with premium interior and advanced safety features.',
        description_ar: 'سيارة دفع رباعي فاخرة بتصميم داخلي راقٍ وميزات أمان متقدمة.',
        image_url: '', availability: true, featured: true
      },
      {
        brand: 'Tesla', model: 'Model 3', year: 2023, price: 38999, color: 'White',
        fuel_type: 'Electric', transmission: 'Automatic', mileage: 15000, engine: 'Dual Motor',
        horsepower: 346, seats: 5,
        description: 'Electric performance sedan with autopilot and long range.',
        description_ar: 'سيارة سيدان كهربائية عالية الأداء مع الطيار الآلي ومدى طويل.',
        image_url: '', availability: true, featured: true
      },
      {
        brand: 'Honda', model: 'Civic', year: 2020, price: 16999, color: 'Blue',
        fuel_type: 'Petrol', transmission: 'Manual', mileage: 55000, engine: '2.0L',
        horsepower: 158, seats: 5,
        description: 'Sporty compact car with excellent resale value.',
        description_ar: 'سيارة مدمجة رياضية بقيمة إعادة بيع ممتازة.',
        image_url: '', availability: true, featured: false
      },
      {
        brand: 'Mercedes-Benz', model: 'C-Class', year: 2021, price: 37999, color: 'Gray',
        fuel_type: 'Petrol', transmission: 'Automatic', mileage: 28000, engine: '2.0L Turbo',
        horsepower: 255, seats: 5,
        description: 'Elegant luxury sedan with a refined interior ride.',
        description_ar: 'سيارة سيدان فاخرة أنيقة بمقصورة مريحة ورحلة راقية.',
        image_url: '', availability: true, featured: false
      },
      {
        brand: 'Ford', model: 'Mustang', year: 2022, price: 42999, color: 'Red',
        fuel_type: 'Petrol', transmission: 'Automatic', mileage: 21000, engine: '5.0L V8',
        horsepower: 450, seats: 4,
        description: 'Iconic American muscle car with thrilling V8 power.',
        description_ar: 'سيارة عضلية أمريكية أيقونية بقوة محرك V8 مذهلة.',
        image_url: '', availability: true, featured: false
      }
    ];

    for (const car of cars) {
      await pool.query(
        `INSERT INTO cars (brand, model, year, price, color, fuel_type, transmission, mileage, engine, horsepower, seats, description, description_ar, image_url, availability, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [car.brand, car.model, car.year, car.price, car.color, car.fuel_type, car.transmission,
         car.mileage, car.engine, car.horsepower, car.seats, car.description, car.description_ar,
         car.image_url, car.availability, car.featured]
      );
    }
    console.log(`${cars.length} sample cars added.\n`);

    // 4. Seed default site content (English + Arabic rows)
    console.log('Seeding site content (en + ar)...');
    const content = [
      {
        key: 'hero_title',
        en: 'Find Your Perfect Car',
        ar: 'اعثر على سيارتك المثالية'
      },
      {
        key: 'hero_subtitle',
        en: 'Browse our premium selection of quality vehicles at unbeatable prices.',
        ar: 'تصفح مجموعتنا المميزة من المركبات عالية الجودة بأسعار لا تُضاهى.'
      },
      {
        key: 'about_text',
        en: 'At Modern Motors, we have been helping customers find the perfect vehicle for over 20 years. Our experienced team is dedicated to providing quality cars, transparent pricing, and outstanding after-sales service.',
        ar: 'في شركة مودرن موتورز، نساعد عملاءنا في العثور على السيارة المثالية منذ أكثر من 20 عامًا. فريقنا المتمرس مكرس لتقديم سيارات عالية الجودة وأسعار شفافة وخدمة ما بعد البيع ممتازة.'
      },
      {
        key: 'contact_phone',
        en: '+1 (555) 123-4567',
        ar: '+1 (555) 123-4567'
      },
      {
        key: 'contact_email',
        en: 'info@modernmotors.com',
        ar: 'info@modernmotors.com'
      },
      {
        key: 'contact_address',
        en: '123 Main Street, Springfield',
        ar: 'شارع مين ستريت 123، سبرينغفيلد'
      },
      {
        key: 'contact_hours',
        en: 'Sat–Thu, 9:00 AM – 7:00 PM',
        ar: 'السبت–الخميس، 9:00 صباحًا – 7:00 مساءً'
      },
      {
        key: 'branch_1_name',
        en: 'Downtown Showroom',
        ar: 'معرض وسط المدينة'
      },
      {
        key: 'branch_1_address',
        en: '123 Main Street, Springfield',
        ar: 'شارع مين ستريت 123، سبرينغفيلد'
      },
      {
        key: 'branch_1_phone',
        en: '+1 (555) 123-4567',
        ar: '+1 (555) 123-4567'
      },
      {
        key: 'branch_1_email',
        en: 'sales.downtown@modernmotors.com',
        ar: 'sales.downtown@modernmotors.com'
      },
      {
        key: 'branch_1_hours',
        en: 'Sat–Thu, 9:00 AM – 7:00 PM',
        ar: 'السبت–الخميس، 9:00 صباحًا – 7:00 مساءً'
      },
      {
        key: 'branch_2_name',
        en: 'Airport Service Center',
        ar: 'مركز خدمة المطار'
      },
      {
        key: 'branch_2_address',
        en: '45 Airport Road, Terminal Area',
        ar: 'طريق المطار 45، منطقة المحطات'
      },
      {
        key: 'branch_2_phone',
        en: '+1 (555) 987-6543',
        ar: '+1 (555) 987-6543'
      },
      {
        key: 'branch_2_email',
        en: 'service@modernmotors.com',
        ar: 'service@modernmotors.com'
      },
      {
        key: 'branch_2_hours',
        en: 'Sat–Thu, 8:00 AM – 6:00 PM',
        ar: 'السبت–الخميس، 8:00 صباحًا – 6:00 مساءً'
      }
    ];

    for (const item of content) {
      for (const lang of ['en', 'ar']) {
        await pool.query(
          `INSERT INTO site_content (section_key, lang, content)
           VALUES ($1, $2, $3)
           ON CONFLICT (section_key, lang) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`,
          [item.key, lang, item[lang]]
        );
      }
    }
    console.log(`${content.length} site content items x 2 languages added.\n`);

    // 4b. Seed branches by migrating the existing static branch site_content
    // (branch_1_* / branch_2_*) into the new branches table so the existing
    // two branches are preserved exactly as they were.
    console.log('Seeding branches from existing site content...');
    const contentRows = (await pool.query('SELECT section_key, lang, content FROM site_content')).rows;
    const getVal = (key) => {
      const en = contentRows.find((r) => r.section_key === key && r.lang === 'en')?.content || '';
      const ar = contentRows.find((r) => r.section_key === key && r.lang === 'ar')?.content || '';
      return { en, ar };
    };
    const branchGroups = [
      { n: 1, nameKey: 'branch_1_name', addrKey: 'branch_1_address', phoneKey: 'branch_1_phone', emailKey: 'branch_1_email', hoursKey: 'branch_1_hours' },
      { n: 2, nameKey: 'branch_2_name', addrKey: 'branch_2_address', phoneKey: 'branch_2_phone', emailKey: 'branch_2_email', hoursKey: 'branch_2_hours' }
    ];
    const existingBranchCount = (await pool.query('SELECT COUNT(*) AS c FROM branches')).rows[0].c;
    if (Number(existingBranchCount) === 0) {
      for (const g of branchGroups) {
        const name = getVal(g.nameKey);
        const addr = getVal(g.addrKey);
        const phone = getVal(g.phoneKey).en;
        const email = getVal(g.emailKey).en;
        const hours = getVal(g.hoursKey);
        await pool.query(
          `INSERT INTO branches
            (name_ar, name_en, address_ar, address_en, phone, mobile, email, working_hours_ar, working_hours_en, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)`,
          [name.ar, name.en, addr.ar, addr.en, phone, null, email, hours.ar, hours.en]
        );
      }
      console.log(`2 sample branches added (migrated from site content).\n`);
    } else {
      console.log(`Branches already exist (${existingBranchCount}); skipping migration.\n`);
    }

    // 5. Seed sample bookings
    console.log('Seeding sample bookings...');
    const carIds = (await pool.query(`SELECT id, brand, model FROM cars ORDER BY id LIMIT 3`)).rows;
    const bookings = [
      {
        customer_name: 'John Smith', phone_number: '+1 555-111-2222', car_id: carIds[0]?.id || null,
        service_type: 'Oil Change', preferred_date: '2026-09-15', preferred_time: '09:30',
        notes: 'Full synthetic oil, please.', status: 'pending'
      },
      {
        customer_name: 'Sarah Johnson', phone_number: '+1 555-333-4444', car_id: carIds[1]?.id || null,
        service_type: 'Tire Rotation', preferred_date: '2026-09-16', preferred_time: '14:00',
        notes: '', status: 'confirmed'
      }
    ];

    for (const booking of bookings) {
      await pool.query(
        `INSERT INTO bookings (customer_name, phone_number, car_id, service_type, preferred_date, preferred_time, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [booking.customer_name, booking.phone_number, booking.car_id, booking.service_type,
         booking.preferred_date, booking.preferred_time, booking.notes, booking.status]
      );
    }
    console.log(`${bookings.length} sample bookings added.\n`);

    console.log('=== Database setup complete! ===');
    console.log('Login with: admin / admin123');
  } catch (err) {
    console.error('Setup failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setup();