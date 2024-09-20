import mongoose from "mongoose";

import { ConnectWithMeSchema } from "../Schema/connectWithMeSchema.js";

const ConnectModel = new mongoose.model('ConnectWithMe', ConnectWithMeSchema);

export default class ConnectWithMeRepository {

    static async addUser(userid) {

        try {
            const user = await ConnectModel.findOne({ userId: userid });
            if (user) {
                let storedEndDate  = user.endDate;
                storedEndDate = storedEndDate.toISOString().split('T')[0];
                const endDateParts = storedEndDate.split('-');
                const endDate = new Date(endDateParts[0], endDateParts[1] - 1, endDateParts[2]); // months are 0-indexed

                // Step 2: Add 30 days to the end date
                endDate.setDate(endDate.getDate() + 30);

                // Step 3: Convert the new end date back to the 'YYYY-MM-DD' format
                const newEndYear = endDate.getFullYear();
                const newEndMonth = String(endDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
                const newEndDay = String(endDate.getDate()).padStart(2, '0');
                const newFormattedEndDate = `${newEndYear}-${newEndMonth}-${newEndDay}`;
                user.endDate = newFormattedEndDate;
                await user.save();
                return user;
            } else {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const day = String(today.getDate()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`; // This is the start date in a formatted string

                // Calculate the future date by adding 30 days
                const futureDate = new Date(today); // Make a copy of the original date
                futureDate.setDate(today.getDate() + 30); // Add 30 days to the current date

                // If you want the future date in the same formatted format
                const futureYear = futureDate.getFullYear();
                const futureMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
                const futureDay = String(futureDate.getDate()).padStart(2, '0');
                const formattedFutureDate = `${futureYear}-${futureMonth}-${futureDay}`; // Future date in YYYY-MM-DD format

                const newUser = new ConnectModel({ userId: userid, startDate: formattedDate, endDate: formattedFutureDate });
                await newUser.save();
                return newUser;
            }
        } catch (err) {
            console.log(err);

        }
    }

    static async getUser() {
        try {
            const users = await ConnectModel.find();
            return users;
        } catch (err) {
            console.log(err);

        }
    }

    static async deleteUser(userid){
        try{
            const user = await ConnectModel.deleteOne({_id:userid});
            return user;
        }catch(err){
            console.log(err);
            
        }
    }
}