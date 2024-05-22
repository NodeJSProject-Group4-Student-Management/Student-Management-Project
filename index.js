const express = require("express");

const pool = require("./database");

const studentRoute = require("./routes/student");
const departmantRoute = require("./routes/departmant");
const studentdepartmantRoute = require("./routes/student-department");
const {login,register} = require('./routes/login/index');
const userverifyToken = require('./middleware/verify_token');
const adminverifyToken = require('./middleware/admin_token');
const mail = require("./mail");

const app = express();

const PORT = 9999;

app.use(express.json());

const firstMessage = `
    <div style="text-align: center;">
        <h1>Hello FROM STUDENT MANAGEMENT!
        <br/>
        Created by Group-4
        </h1>
        <button onclick="window.location.href='/ogrenciler'">Ogrencilere Git</button>
        <br/>
        <br/>
        <button onclick="window.location.href='/bolumler'">Bolumlere Git</button>
    </div>
`;

app.get("/", (req, res) => {
  res.send(firstMessage);
});

// get veriyi getirmek için kullanılır.
// post yeni veri oluşturmak için kullanılır.
// put var olan veriyi güncellemek için kullanılır. postta veri güncellemek için kullanılabilir.

// register , login router

app.post('/login',login);
app.post('/register',register);

// verify middleware -> Eğer bu middleware'da token oluştuysa diğer routerlara geçiş yapıp sorgu yapabilir.

app.use(userverifyToken)

// ogrenci route'ları

app.get("/ogrenciler", studentRoute.getAllStudents);

app.get("/bolumler", departmantRoute.getAllDepartments);

// admin verify
app.use(adminverifyToken)

app.post("/ogrenciekle", studentRoute.addStudent);

app.post("/ogrencisil", studentRoute.deleteStudent);

app.put("/ogrenciguncelle", studentRoute.updateStudent);

// Haftalık rapor dışında güncel verileri anlık mail atmak istersek

app.get("/mail-gonder", studentRoute.sendMail);

// bolum route'ları

app.post("/bolumekle", departmantRoute.addDepartment);

app.post("/bolumsil", departmantRoute.deleteDepartment);

app.put("/bolumguncelle", departmantRoute.updateDepartment);

//TODO ogrenci bolum birlestir fonksiyonu ekle
app.post(
  "/ogrencibolumbirlestir",
  studentdepartmantRoute.combineStudentDepartment
);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
