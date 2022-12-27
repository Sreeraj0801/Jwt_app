const { register, login ,addImage ,adminLogin ,getUsers ,deleteUser ,editUser ,doEditUser} = require('../Controllers/AuthControllers');
const { checkUser,checkAdmin } = require('../Middlewares/AuthMiddlewares');
const router = require('express').Router();


const multer = require('multer');

//<-----------------For Product Images ----------->
const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"public/pictures")
    },
    filename : function(req,file,callback){
        callback(null,file.originalname+'-'+Date.now())
    }
})
const upload =  multer({
    storage : storage
})



router.post('/',checkUser);
router.post('/register',register);
router.post('/login',login);
router.post('/addImage',upload.any('file'),addImage);


//admin Routes
router.post('/adminLogin',adminLogin);
router.post('/adminHome',checkAdmin);
router.get('/getUsers',getUsers);
router.post('/deleteUser',deleteUser);

router.post('/editUser/',editUser);
router.post('/doEditUser',doEditUser)

module.exports = router;