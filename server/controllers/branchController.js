const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const parseBool = (v, def) => {
  if (v === undefined || v === null || v === '') return def;
  return v === true || v === 1 || v === '1' || v === 'true';
};

const parseNum = (v) => {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const parseStr = (v) => (v === undefined || v === null || v === '') ? null : v;

exports.getActiveBranches = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM branches WHERE is_active = true ORDER BY created_at ASC, id ASC'
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getActiveBranches error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching branches.' });
  }
};

exports.getBranches = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches ORDER BY created_at ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getBranches error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching branches.' });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getBranchById error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching the branch.' });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const b = req.body;

    if (!parseStr(b.name_en) || !parseStr(b.name_ar)) {
      return res.status(400).json({ success: false, message: 'Branch name (English and Arabic) is required.' });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO branches
        (name_ar, name_en, address_ar, address_en, phone, mobile, email, working_hours_ar, working_hours_en, maps_url, latitude, longitude, image_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        b.name_ar, b.name_en,
        parseStr(b.address_ar), parseStr(b.address_en),
        parseStr(b.phone), parseStr(b.mobile), parseStr(b.email),
        parseStr(b.working_hours_ar), parseStr(b.working_hours_en),
        parseStr(b.maps_url),
        parseNum(b.latitude), parseNum(b.longitude),
        image_url,
        parseBool(b.is_active, true)
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('createBranch error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating the branch.' });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branchId = req.params.id;

    const existingResult = await pool.query('SELECT * FROM branches WHERE id = $1', [branchId]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found.' });
    }
    const existing = existingResult.rows[0];
    const b = req.body;

    let image_url = existing.image_url;
    if (req.file) {
      if (existing.image_url && existing.image_url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', 'uploads', path.basename(existing.image_url));
        fs.unlink(oldPath, () => {});
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const merge = (newVal, existingVal) =>
      (newVal === undefined || newVal === null || newVal === '') ? existingVal : newVal;

    const result = await pool.query(
      `UPDATE branches SET
        name_ar = $1, name_en = $2, address_ar = $3, address_en = $4,
        phone = $5, mobile = $6, email = $7,
        working_hours_ar = $8, working_hours_en = $9, maps_url = $10,
        latitude = $11, longitude = $12, image_url = $13, is_active = $14,
        updated_at = NOW()
       WHERE id = $15
       RETURNING *`,
      [
        merge(b.name_ar, existing.name_ar),
        merge(b.name_en, existing.name_en),
        merge(b.address_ar, existing.address_ar),
        merge(b.address_en, existing.address_en),
        merge(b.phone, existing.phone),
        merge(b.mobile, existing.mobile),
        merge(b.email, existing.email),
        merge(b.working_hours_ar, existing.working_hours_ar),
        merge(b.working_hours_en, existing.working_hours_en),
        merge(b.maps_url, existing.maps_url),
        parseNum(b.latitude === undefined ? existing.latitude : b.latitude),
        parseNum(b.longitude === undefined ? existing.longitude : b.longitude),
        image_url,
        parseBool(b.is_active, existing.is_active),
        branchId
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateBranch error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating the branch.' });
  }
};

exports.toggleBranchActive = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found.' });
    }
    const current = result.rows[0];
    const isActive = !current.is_active;
    const updated = await pool.query(
      'UPDATE branches SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [isActive, req.params.id]
    );
    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    console.error('toggleBranchActive error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating the branch.' });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM branches WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Branch not found.' });
    }
    const branch = result.rows[0];
    if (branch.image_url && branch.image_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(branch.image_url));
      fs.unlink(filePath, () => {});
    }
    await pool.query('DELETE FROM branches WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Branch deleted successfully.' });
  } catch (err) {
    console.error('deleteBranch error:', err);
    res.status(500).json({ success: false, message: 'Server error while deleting the branch.' });
  }
};
