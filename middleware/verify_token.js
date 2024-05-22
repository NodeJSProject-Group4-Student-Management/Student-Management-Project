const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.query.token // mevcut token bilgisini header veya body'den de alabilirdik.

    if(token){
        jwt.verify(token,process.env.SECRET_API_KEY,(err,decoded)=>{
            if(err){
                console.log(err)
                res.status(401).json({msg:"Token dogrulama basarisiz."})
            }else{
                req.decode = decoded; // çözülmüş token atanır.
                next(); // bu işlemle beraber eğer token varsa diğer routerlara erişim sağlanabiliriz.
            }
        }) //3.parametre token'in çözülüp çözülmediğini gösteriyor.
    }else{
        res.status(500).json({msg:"Token girilmedi."})
    }
}