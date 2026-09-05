const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const parseNum = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const parseBool = (v, def) => {
  if (v === undefined || v === null || v === '') return def;
  return v === true || v === 1 || v === '1' || v === 'true';
};

const parseStr = (v) => (v === undefined || v === null || v === '') ? null : v;

exports.getCars = async (req, res) => {
  try {
    const { brand, year, minPrice, maxPrice, fuelType, transmission, availability } = req.query;
    let query = 'SELECT * FROM cars WHERE 1=1';
    const params = [];

    if (brand) {
      params.push(brand);
      query += ` AND brand ILIKE $${params.length}`;
    }
    if (year) {
      params.push(year);
      query += ` AND year = $${params.length}`;
    }
    if (minPrice) {
      params.push(minPrice);
      query += ` AND price >= $${params.length}`;
    }
    if (maxPrice) {
      params.push(maxPrice);
      query += ` AND price <= $${params.length}`;
    }
    if (fuelType) {
      params.push(fuelType);
      query += ` AND fuel_type = $${params.length}`;
    }
    if (transmission) {
      params.push(transmission);
      query += ` AND transmission = $${params.length}`;
    }
    if (availability) {
      params.push(availability === 'true' || availability === '1');
      query += ` AND availability = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC, id DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getCars error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching cars.' });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cars WHERE featured = true ORDER BY created_at DESC, id DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getFeatured error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching featured cars.' });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getCarById error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching the car.' });
  }
};

exports.createCar = async (req, res) => {
  try {
    const b = req.body;
    const year = parseNum(b.year);
    const price = parseNum(b.price);

    if (!b.brand || !b.model) {
      return res.status(400).json({ success: false, message: 'Brand and model are required.' });
    }
    if (year === null || price === null) {
      return res.status(400).json({ success: false, message: 'Valid numeric year and price are required.' });
    }

    const files = req.files || {};
    const primaryFile = (files.image && files.image[0]) || (files.images && files.images[0]) || null;
    const extraFiles = files.images || [];
    const image_url = primaryFile ? `/uploads/${primaryFile.filename}` : null;

    const result = await pool.query(
      `INSERT INTO cars
        (brand, model, year, price, color, fuel_type, transmission, mileage, engine, horsepower, seats, description, description_ar, image_url, availability, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        b.brand, b.model, year, price,
        parseStr(b.color), parseStr(b.fuel_type), parseStr(b.transmission),
        parseNum(b.mileage), parseStr(b.engine), parseNum(b.horsepower), parseNum(b.seats),
        parseStr(b.description), parseStr(b.description_ar), image_url,
        parseBool(b.availability, true),
        parseBool(b.featured, false)
      ]
    );

    const car = result.rows[0];
    if (image_url) {
      await pool.query(
        'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES ($1, $2, true, 1)',
        [car.id, image_url]
      );
      let sortOrder = 1;
      for (const file of extraFiles) {
        if (primaryFile && file.filename === primaryFile.filename) continue;
        sortOrder += 1;
        await pool.query(
          'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES ($1, $2, false, $3)',
          [car.id, `/uploads/${file.filename}`, sortOrder]
        );
      }
    }

    res.status(201).json({ success: true, data: car });
  } catch (err) {
    console.error('createCar error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating the car.' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;

    const existingResult = await pool.query('SELECT * FROM cars WHERE id = $1', [carId]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }
    const existing = existingResult.rows[0];
    const b = req.body;

    let image_url = existing.image_url;
    const files = req.files || {};
    const primaryFile = Array.isArray(files.image) && files.image[0] ? files.image[0] : null;
    if (primaryFile) {
      if (existing.image_url && existing.image_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', 'uploads', path.basename(existing.image_url));
        fs.unlink(oldPath, () => {});
      }
      image_url = `/uploads/${primaryFile.filename}`;
      await pool.query('UPDATE car_images SET is_primary = false WHERE car_id = $1', [carId]);
      await pool.query(
        'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES ($1, $2, true, 0)',
        [carId, image_url]
      );
    }
    // Append any additional gallery images
    const extraFiles = Array.isArray(files.images) ? files.images.filter((f) => !primaryFile || f.filename !== primaryFile.filename) : [];
    if (extraFiles.length > 0) {
      const maxSort = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS m FROM car_images WHERE car_id = $1', [carId]);
      let sortOrder = maxSort.rows[0].m;
      for (const file of extraFiles) {
        sortOrder += 1;
        await pool.query(
          'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES ($1, $2, false, $3)',
          [carId, `/uploads/${file.filename}`, sortOrder]
        );
      }
    }

    const merge = (newVal, existingVal) =>
      (newVal === undefined || newVal === null || newVal === '') ? existingVal : newVal;

    const result = await pool.query(
      `UPDATE cars SET
        brand = $1, model = $2, year = $3, price = $4, color = $5, fuel_type = $6,
        transmission = $7, mileage = $8, engine = $9, horsepower = $10, seats = $11,
        description = $12, description_ar = $13, image_url = $14, availability = $15, featured = $16,
        updated_at = NOW()
       WHERE id = $17
       RETURNING *`,
      [
        merge(b.brand, existing.brand),
        merge(b.model, existing.model),
        merge(b.year, existing.year),
        merge(b.price, existing.price),
        merge(b.color, existing.color),
        merge(b.fuel_type, existing.fuel_type),
        merge(b.transmission, existing.transmission),
        merge(b.mileage, existing.mileage),
        merge(b.engine, existing.engine),
        merge(b.horsepower, existing.horsepower),
        merge(b.seats, existing.seats),
        merge(b.description, existing.description),
        merge(b.description_ar, existing.description_ar),
        image_url,
        parseBool(b.availability, existing.availability),
        parseBool(b.featured, existing.featured),
        carId
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateCar error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating the car.' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const car = result.rows[0];
    if (car.image_url && car.image_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(car.image_url));
      fs.unlink(filePath, () => {});
    }

    const images = await pool.query('SELECT image_url FROM car_images WHERE car_id = $1', [car.id]);
    for (const img of images.rows) {
      if (img.image_url && img.image_url.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', 'uploads', path.basename(img.image_url));
        fs.unlink(filePath, () => {});
      }
    }

    await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Car deleted successfully.' });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ success: false, message: 'Cannot delete this car because it has bookings referencing it. Delete those bookings first.' });
    }
    console.error('deleteCar error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting the car.' });
  }
};