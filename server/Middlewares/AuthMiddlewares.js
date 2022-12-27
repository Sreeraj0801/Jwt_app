const { login } = require('../Controllers/AuthControllers');
const User = require('../Models/UserModels');
const jwt = require('jsonwebtoken');

module.exports.checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'super secret key',async (err,decodedToken) => {
            if(err){
                res.json({status:false});
                next()
            }
            else {
                const user = await User.findById(decodedToken.id);
                if(user) res.json({status:true, user:user});
                else res.json({status:false});
                next() 
                
            }
        });
    }
    else {
        res.json({status:false});
        next();
    }
}

module.exports.checkAdmin = (req,res,next) => {
    const token = req.cookies.adminCookie;
    console.log(req.cookies);
    if(token)
    {
        jwt.verify(token,'super secret key',async (err,decodedToken) => {
            if(err){
                res.json({status:false});
                next ()
            }
            else {
                res.json({status:true});
                next()
            }
        })
    }
}