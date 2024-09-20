import mongoose from "mongoose";

export const PersonalNewsLetterSchema = new mongoose.Schema({
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   startDate:{
    type:Date,
   },
   endDate:{
    type:Date
   }
})