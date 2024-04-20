require('dotenv').config(); 
const fs = require('fs');
const pool = require('../../database');
const nodemailer = require('nodemailer');

const periyot = process.env.PERIYOT;


async function backupStudents() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ogrenci');
    const students = result.rows;
    await client.release();

    fs.writeFileSync('ogrenci_listesi.json', JSON.stringify(students));

    sendEmail('sametgumus2009@hotmail.com', 'Öğrenci Listesi Yedeği', 'Öğrenci listesi ektedir.', 'ogrenci_listesi.json');
  } catch (error) {
    console.error('Yedekleme hatası:', error);
  }
}

// E-posta gönderimi işlemi
async function sendEmail(to, subject, text, attachment) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testnodejs652@gmail.com',
        pass: 'hesap1234',
      },
    });

    // E-posta bilgileri
    const mailOptions = {
      from: 'testnodejs652@gmail.com',
      to: to,
      subject: subject,
      text: text,
      attachments: [{ path: attachment }],
    };

    // E-posta gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.response);
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
  }
}

// const scheduleBackup = () => {
//   const schedule = require('node-schedule');
//   schedule.scheduleJob(`0 9 * * ${periyot}`, () => {
//     console.log('Haftalık yedekleme başlatılıyor...');
//     backupStudents();
//   });
// };

// scheduleBackup();
backupStudents();
