const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./Routes/AuthRoutes');
const cookieParser = require('cookie-parser');
const path = require('path')
app.listen(4000,()=>{
    console.log('Server Started On PORT 4000');
});

mongoose.connect('mongodb://localhost:27017/jwt',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB connection Succesfull");
}).catch((err)=>{
    console.log(err.message);
})


app.use(cors({
    origin:["http://localhost:3000"],
    methods:['GET','POST'],
    credentials:true
}))
app.use(express.static('public'))
app.use(cookieParser());
app.use(express.json());
app.use('/',authRoutes);