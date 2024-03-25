const pool = require('../../database');

//TODO unique email

// Tüm öğrencileri getiren fonksiyon
async function getAllStudents(req, res) {
    try {
        const result = await pool.query('SELECT * FROM ogrenci');
        res.json(result.rows);
    } catch (err) {
        console.error('Öğrenciler alınırken bir hata oluştu:', err);
        res.status(500).json({ error: 'Öğrenciler alınırken bir hata oluştu.' });
    }
}

// Öğrenci ekleme fonksiyonu
async function addStudent(req, res) {
    const { name, email, counter } = req.body;
    try {
        const result = await pool.query('INSERT INTO ogrenci (name, email, counter) VALUES ($1, $2, $3) RETURNING *', [name, email, counter]);
        if (result.rowCount === 1) {
            const addedStudent = result.rows[0];
            res.status(201).json({ success: true, message: 'Öğrenci başarıyla eklendi.', student: addedStudent });
        } else {
            res.status(500).json({ success: false, error: 'Öğrenci eklenirken bir hata oluştu.' });
        }
    } catch (err) {
        console.error('Öğrenci eklenirken bir hata oluştu:', err);
        res.status(500).json({ success: false, error: 'Öğrenci eklenirken bir hata oluştu.' });
    }
}

// Öğrenci silme fonksiyonu
async function deleteStudent(req, res) {
    const { id } = req.body;
    try {
        // ogrenciye bağlı bolum var mı? varsa dept_std_id'yi null yap
        await pool.query('UPDATE bolum SET dept_std_id = NULL WHERE dept_std_id = $1', [id]);
        
        // ogrenci silen kod kısmı
        const result = await pool.query('DELETE FROM ogrenci WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı.' });
        }
        res.json({ message: 'Öğrenci başarıyla silindi.', deletedStudent: result.rows[0] });
    } catch (err) {
        console.error('Öğrenci silinirken bir hata oluştu:', err);
        res.status(500).json({ error: 'Öğrenci silinirken bir hata oluştu.' });
    }
}

// Öğrenci verisi güncelleme fonksiyonu
async function updateStudent(req, res) {
    const { id, name, email, counter } = req.body;
    try {
        const result = await pool.query('UPDATE ogrenci SET name = $1, email = $2, counter = $3 WHERE id = $4 RETURNING *', [name, email, counter, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Öğrenci bulunamadı.' });
        }
        res.json({ success: true, message: 'Öğrenci başarıyla güncellendi.', updatedStudent: result.rows[0] });
    } catch (err) {
        console.error('Öğrenci güncellenirken bir hata oluştu:', err);
        res.status(500).json({ success: false, error: 'Öğrenci güncellenirken bir hata oluştu.' });
    }
}

module.exports = { getAllStudents, addStudent, deleteStudent, updateStudent };