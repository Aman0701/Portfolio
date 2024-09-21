
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:Number,
        required:true
    },
    transaction:[{
        type:String,
        unique:true
    }]
})
