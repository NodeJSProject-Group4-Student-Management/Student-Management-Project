const pool = require("../../database");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const login = async (req,res) => {
    const {username,password} = req.body;
    try{
        const user = await pool.query("SELECT * FROM users WHERE username=$1",[username]) //once kayıtlı username var mı yok mu kontrolü.
        if(user.rowCount==0){
            res.status(401).json({msg:"Login islemi basarisiz.",error:"Kullanıcı kaydı bulunamadı."})
        }else{
            const checkedPW = await bcrypt.compare(password,user.rows[0].password)
            if(!checkedPW){
                return res.status(401).json({msg:"Login islemi basarisiz.",error:"Hatali parola"})
            }else {
                const payload = { // Burada gizli bilgilerden ziyade userid ,rol ,username gibi şeyler girilmeli. Bu bilgiler token içerisinde taşınır.
                    username:user.rows[0].username,
                    role:user.rows[0].role
                }
                const token = jwt.sign(payload,process.env.SECRET_API_KEY,{expiresIn: 720})
                return res.status(200).json({token}) // Basarili giris yapmış kullanıcı icin token olusturulur.
            }
        }
    }catch(error){
        res.status(500).json({error})
    }
}

const register = async (req,res) => {
    const {username,password} = req.body;
    const role = 'user'

    try{
        const checkUserName = await pool.query("SELECT * FROM users WHERE username=$1",[username]);
        if(checkUserName.rowCount!=0){
            return res.status(409).json({msg:"Bu kullanici adi daha once alinmis"});
        }
        const hashedPW = await bcrypt.hash(password,10)
        const user = await pool.query("INSERT INTO users (username,password,role) values ($1,$2,$3)",[username,hashedPW,role])

        if(user.rowCount!=0){
            res.status(201).json({msg:"Kullanıcı Kayıtı başarıyla oluşturuldu."})
        }

    } catch(error){
        console.log(error)
        res.status(500).json({error})
    }
}


module.exports = {login,register}