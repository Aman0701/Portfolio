
import DateModel from "../models/dateModel.js";
import { instance } from "../../index.js";
import crypto from 'crypto';
import SendEmail from "./sendEmailController.js";
import { addTransactionEmail } from "./storeFileController.js";
import { sheets } from "googleapis/build/src/apis/sheets/index.js";
import ConnectWithMeRepository from "../Repository/ConnectWithMerepostory.js";
import UserRepository from "../Repository/UserRepository.js";
import PersonalNewsLetterRepository from "../Repository/personalnewsLetterRepository.js";
export const checkOut = async (req, res) => {
    try {
        const price = parseFloat(req.body.amount);
        const options = {
            amount: price * 100,
            currency: "INR"
        };
        const order = await instance.orders.create(options);
        res.status(200).json({ Success: true, orderId: order.id });
    } catch (err) {
        console.log(err);

    }

}

export const paymentVerification = async (req, res) => {

    const { order_id, payment_id, signature,name,amount,email,contact } = req.body;
    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)

        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === signature;
    const daysRemaining = 30;
    let googlesheet;
    let database;
    if(amount == 199){
        googlesheet = 1;
        database = PersonalNewsLetterRepository;
    }else{
        googlesheet = 2;
        database = ConnectWithMeRepository;
    }
    if (isAuthentic) {
        const timestamp = Date.now();
        const date = DateModel.getDate(timestamp);
        const time = DateModel.getTime(timestamp);
        const user = await UserRepository.addUser(name,email,contact,payment_id);
        const newUser = await database.addUser(user._id,);
        addTransactionEmail(name,email,contact,daysRemaining,payment_id,googlesheet);
        const sendEmail = new SendEmail();
        sendEmail.sendmail(email,name,newUser.endDate,payment_id,amount,date,time);
        res.render('paymentSuccess', { payment_id: payment_id, amount: amount, name: name, date: date, time: time });
    } else {
        res.status(400).json({ success: false })
    }
}