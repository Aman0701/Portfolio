import mongoose from "mongoose";
import ConnectWithMeRepository from "../Repository/ConnectWithMerepostory.js";

export default class UserController{


    getFirstPage(req,res){        
        res.render('index');
    }

    getTermsPage(req,res){    
        res.render('terms');
    }

    getPrivacyPage(req,res){
        res.render('privacy')
    }

    async getServicePage(req,res){
        const users = await ConnectWithMeRepository.getUser();
        const remainingUser = 50 - users.length
        res.render('service',{remainingUser:remainingUser})
    }

    // getDetailPage(req,res){
    //     const price = parseFloat(req.query.price);
    //     const subscription = req.query.sub;    
    //     res.render('details',{price:price,sub:subscription});
    // }
}