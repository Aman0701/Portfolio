import mongoose from "mongoose";

import { UserSchema } from "../Schema/userSchema.js";
import userModel from "../models/UserModel.js";

const UserModel = new mongoose.model('User',UserSchema);

export default class UserRepository{

    static async addUser(name,email,contact,transactionId){
        try{
            const user = await UserModel.findOne({email:email});
            console.log(user);
            
            if(user){
                user.transaction.push(transactionId);
                await user.save();
                return user;
            }else{
                const newUser = new userModel(name,email,contact,transactionId);
                const User = new UserModel(newUser);
                await User.save();
                return User; 
            }
        }catch(err){
            console.log(err);
            
        }
    }
}