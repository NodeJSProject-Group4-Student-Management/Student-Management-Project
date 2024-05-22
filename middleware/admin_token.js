const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.query.token // mevcut token bilgisini header veya body'den de alabilirdik.

    if(token){
        jwt.verify(token,process.env.SECRET_API_KEY,(err,decoded)=>{
            if(err){
                console.log(err)
                res.status(401).json({msg:"Token dogrulama basarisiz."})
            }else{ // bu işlemle beraber eğer token varsa diğer routerlara erişim sağlanabiliriz.
                if(decoded.role=='admin'){
                    req.decode = decoded
                    return next();
                }
                res.status(401).json({msg:"Token erisim kısıtllı."})
            }
        }) //3.parametre token'in çözülüp çözülmediğini gösteriyor.
    }else{
        res.status(500).json({msg:"Token girilmedi."})
    }
}