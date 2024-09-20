import express from 'express';
import { checkOut,paymentVerification } from '../controller/paymentController.js'; 

const paymentRouter = express.Router();


paymentRouter.route("/checkout").post(checkOut);

paymentRouter.route("/paymentverification").post(paymentVerification)

export default paymentRouter;