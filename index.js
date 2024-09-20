import { configure } from './config.js';
import express from 'express';
import { connectUsingMongoose } from './src/config/mongoConfig.js';
import path from 'path';
import ejsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import Razorpay from 'razorpay';
import cors from 'cors';
import paymentRouter from './src/routes/paymentRouter.js';
import UserController from './src/controller/userController.js';


const server = express();


server.use(express.urlencoded({extended:true}));
server.use(express.json());
server.use(cors());
server.set("view engine","ejs");
server.set("views",path.join(path.resolve(),'src','views'));

server.use(express.static('public'));

server.use(session({
    secret:'secretKey',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false},
})
);

server.use(ejsLayouts);


server.use(express.static('src/views'));

export const instance = new Razorpay({
    key_id:process.env.RAZORPAY_API_KEY,
    key_secret:process.env.RAZORPAY_API_SECRET
});

server.use('/api',paymentRouter);

server.get('/api/getkey',(req,res)=>{
    res.status(200).json({key:process.env.RAZORPAY_API_KEY});
})

const userController = new UserController;

server.get("/",userController.getFirstPage);

server.get('/terms',userController.getTermsPage);

server.get('/privacy',userController.getPrivacyPage);

server.get('/service',userController.getServicePage);


server.get('/error',(req,res)=>{
    res.render('error');
})

server.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);  
    connectUsingMongoose();  
});
