const UserModels = require("../Models/UserModels");
const mongoose = require('mongoose');
const jwt =  require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;



const createToken = (id) => {
    return jwt.sign({id},'super secret key',{
        expiresIn:maxAge,
    })
};

const handleErrors = (err) => {
    let errors = {email:"",password: ""};

    if(err.message === "Incorrect Email") errors.email = "That email is not registerd";
    if(err.message === "Incorrect Password") errors.password = "Incorrect Password";

    if(err.code === 11000) {
        errors.email = "Email  already registered";
        return errors;
     }

        if(err.message.includes('Users validation failed')){
            Object.values(err.errors).forEach(({properties}) => {
                errors[properties.path] = properties.message;
                console.log(errors);
            })
        }
        return errors;
};

module.exports.register = async(req, res, next) => {
    try {
        const {email,password,name} = req.body;
        const user = await UserModels.create({email,password,name});
        const token = createToken(user._id);

        res.cookie('jwt',token,{
            withCrdentials:true,
            httpOnly : false,
            maxAge: maxAge * 1000,
        })

        res.status(201).json({user:user._id,created:true})
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({errors,created: false});
    }
};

module.exports.login = async(req, res, next) => {
    try {
        const {email,password} = req.body;
        const user = await UserModels.login(email,password);
        const token = createToken(user._id);

        res.cookie('jwt',token,{
            withCrdentials:true,
            httpOnly : false,
            maxAge: maxAge * 1000,
        })

        res.status(200).json({user:user._id,created:true});
        console.log(user._id);
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({errors,created: false});
    }
};

module.exports.addImage = async(req ,res, next) => {
    console.log(req.files[0]);
    try {
        const token = req.cookies.jwt;
        if(token)
        {
            jwt.verify(token,'super secret key',async (err,decodedToken) => {
                if(err){
                    res.json({status:false});
                }
                else {
                    const userId =  decodedToken.id;
                    let filter = {_id:mongoose.mongo.ObjectId(userId)};

                    let update = {
                        image:req.files[0].filename
                    }
                    UserModels.findOneAndUpdate(filter,update).then((data) => {
                        res.json({imageUploaded : true,image:data.image});
                    })
                }
            })
        }
    } catch (error) {
        
    }
}

const admin ={
    adminMail : 'admin@gmail.com',
    adminPassword : 'admin'
}
module.exports.adminLogin = async(req ,res ,next) => {
    
    try {
        const {email,password} = req.body;
        if(email === admin.adminMail && password === admin.adminPassword)
        {
            const token = createToken(email);
            res.cookie('adminCookie' , token ,{
                withCrdentials:true,
                httpOnly : false,
                maxAge : maxAge * 1000,
            })
            res.status(200).json({admin:admin , created : true});
        }
        else {
            const errors = handleErrors(err);
            res.json({errors,created:false})
        }
    } catch (error) {
        console.log(error);
        const errors = handleErrors(error);
        res.json({errors,created:false})
    }
}

module.exports.getUsers = async(req ,res, next) => {
    try {
         details = await UserModels.find();
         res.json({details})
    } catch (error) {
        console.log(error);
    }
}

module.exports.deleteUser = async(req ,res, next) => {
    try {
        let filter = mongoose.mongo.ObjectId(req.body);
        console.log(filter);
        await UserModels.deleteOne({ _id:filter }).then(()=>{
            res.json({status:true})
        })
        } catch (error) {
        
    }
}

module.exports.editUser = async (req ,res,next) => {
    try {
        let id = mongoose.mongo.ObjectId(req.body.id);
        const details = await UserModels.findOne({_id:id});
        res.json(details)
    } catch (error) {
        console.log(error);
    }
}

module.exports.doEditUser = async (req,res,next) => {
    console.log(req.body);
    let filter = mongoose.mongo.ObjectId(req.body.id);
    let update = {
        email:req.body.email,
        name:req.body.name
    }
    UserModels.findOneAndUpdate(filter,update).then((data) => {
        res.json({status:true});
    })
}