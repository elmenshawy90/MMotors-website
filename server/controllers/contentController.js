const pool = require('../config/db');

exports.getContent = async (req, res) => {
  try {
    const result = await pool.query('SELECT section_key, lang, content FROM site_content');
    const data = {};
    result.rows.forEach((row) => {
      if (!data[row.section_key]) {
        data[row.section_key] = {};
      }
      data[row.section_key][row.lang] = row.content;
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error('getContent error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching site content.' });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { sectionKey } = req.params;
    const { content } = req.body;
    const lang = req.body.lang || req.query.lang || 'en';

    if (!['en', 'ar'].includes(lang)) {
      return res.status(400).json({ success: false, message: 'Language must be "en" or "ar".' });
    }

    if (content === undefined || content === null || content === '') {
      return res.status(400).json({ success: false, message: 'Content value is required.' });
    }

    const result = await pool.query(
      `INSERT INTO site_content (section_key, lang, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (section_key, lang)
       DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING section_key, lang, content, updated_at`,
      [sectionKey, lang, content]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updateContent error:', err);
    res.status(500).json({ success: false, message: 'Server error while updating site content.' });
  }
};