const express = require('express');

const pool = require('./database');

const studentRoute = require('./routes/student');
const departmantRoute = require('./routes/departmant');



const app = express();

const PORT = 9999;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello FROM STUDENT MANAGEMENT!');
});


app.get('/ogrenciler', studentRoute.getAllStudents);

app.post('/ogrenciekle', studentRoute.addStudent);

app.post('/ogrencisil', studentRoute.deleteStudent);

app.put('/ogrenciguncelle', studentRoute.updateStudent);


app.get('/bolumler', departmantRoute.getAllDepartments);



app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/`);
});
