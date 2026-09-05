const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getCarImagesByCarId = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, car_id, image_url, is_primary, sort_order, created_at FROM car_images WHERE car_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [req.params.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getCarImages error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching car images.' });
  }
};

exports.uploadCarImages = async (req, res) => {
  try {
    const carId = req.params.id;
    const existing = await pool.query('SELECT id FROM cars WHERE id = $1', [carId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const hasPrimary = await pool.query(
      'SELECT id FROM car_images WHERE car_id = $1 AND is_primary = true',
      [carId]
    );
    const firstIsPrimary = hasPrimary.rows.length === 0;

    const maxSort = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) AS m FROM car_images WHERE car_id = $1',
      [carId]
    );
    let sortOrder = maxSort.rows[0].m;

    const inserted = [];
    for (let i = 0; i < files.length; i++) {
      const imageUrl = `/uploads/${files[i].filename}`;
      const isPrimary = firstIsPrimary && i === 0;
      sortOrder += 1;
      const result = await pool.query(
        `INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING id, car_id, image_url, is_primary, sort_order, created_at`,
        [carId, imageUrl, isPrimary, sortOrder]
      );
      if (isPrimary) {
        await pool.query('UPDATE cars SET image_url = $1, updated_at = NOW() WHERE id = $2', [imageUrl, carId]);
      }
      inserted.push(result.rows[0]);
    }

    res.status(201).json({ success: true, data: inserted });
  } catch (err) {
    console.error('uploadCarImages error:', err);
    res.status(500).json({ success: false, message: 'Server error while uploading images.' });
  }
};

exports.deleteCarImage = async (req, res) => {
  try {
    const { id: carId, imageId } = req.params;
    const result = await pool.query(
      'SELECT * FROM car_images WHERE id = $1 AND car_id = $2',
      [imageId, carId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }
    const image = result.rows[0];

    if (image.image_url && image.image_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(image.image_url));
      fs.unlink(filePath, () => {});
    }

    await pool.query('DELETE FROM car_images WHERE id = $1', [imageId]);

    if (image.is_primary) {
      const next = await pool.query(
        'SELECT id, image_url FROM car_images WHERE car_id = $1 ORDER BY sort_order ASC, id ASC LIMIT 1',
        [carId]
      );
      if (next.rows.length > 0) {
        const nextImage = next.rows[0];
        await pool.query('UPDATE car_images SET is_primary = true WHERE id = $1', [nextImage.id]);
        await pool.query('UPDATE cars SET image_url = $1, updated_at = NOW() WHERE id = $2', [nextImage.image_url, carId]);
      } else {
        await pool.query('UPDATE cars SET image_url = NULL, updated_at = NOW() WHERE id = $1', [carId]);
      }
    }

    res.json({ success: true, message: 'Image deleted successfully.' });
  } catch (err) {
    console.error('deleteCarImage error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting the image.' });
  }
};

exports.setPrimaryCarImage = async (req, res) => {
  try {
    const { id: carId, imageId } = req.params;
    const result = await pool.query(
      'SELECT * FROM car_images WHERE id = $1 AND car_id = $2',
      [imageId, carId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    await pool.query('UPDATE car_images SET is_primary = false WHERE car_id = $1', [carId]);
    await pool.query('UPDATE car_images SET is_primary = true WHERE id = $1', [imageId]);

    const image = result.rows[0];
    await pool.query('UPDATE cars SET image_url = $1, updated_at = NOW() WHERE id = $2', [image.image_url, carId]);

    const images = await pool.query(
      'SELECT id, car_id, image_url, is_primary, sort_order, created_at FROM car_images WHERE car_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [carId]
    );
    res.json({ success: true, data: images.rows });
  } catch (err) {
    console.error('setPrimaryCarImage error:', err);
    res.status(500).json({ success: false, message: 'Server error while setting the primary image.' });
  }
};

exports.reorderCarImages = async (req, res) => {
  try {
    const carId = req.params.id;
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Order must be an array of image ids.' });
    }
    const existing = await pool.query(
      'SELECT id FROM car_images WHERE car_id = $1',
      [carId]
    );
    const validIds = new Set(existing.rows.map((r) => r.id));
    const idSet = order.filter((id) => validIds.has(Number(id)));
    for (let i = 0; i < idSet.length; i++) {
      await pool.query('UPDATE car_images SET sort_order = $1 WHERE id = $2', [i + 1, idSet[i]]);
    }
    const images = await pool.query(
      'SELECT id, car_id, image_url, is_primary, sort_order, created_at FROM car_images WHERE car_id = $1 ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [carId]
    );
    res.json({ success: true, data: images.rows });
  } catch (err) {
    console.error('reorderCarImages error:', err);
    res.status(500).json({ success: false, message: 'Server error while reordering images.' });
  }
};
