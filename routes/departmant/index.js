const pool = require('../../database');


async function getAllDepartments(req, res) {
    try {
        const result = await pool.query('SELECT * FROM bolum');
        res.json(result.rows);
    } catch (err) {
        console.error('Bölümler alınırken bir hata oluştu:', err);
        res.status(500).json({ error: 'Bölümler alınırken bir hata oluştu.' });
    }
}

module.exports = { getAllDepartments };