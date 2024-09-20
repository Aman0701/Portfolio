import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

export default class SendEmail{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.GMAIL_USER,
                pass:process.env.GMAIL_PASSWORD,
            }
        })
    }

    async sendmail(email,name,endDate,payment_id,amount,date,time){
        ejs.renderFile(path.join(path.resolve(), `/src/views/email/sendEmail.ejs`), { name,endDate,payment_id,amount,date,time }, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: "Payment Received",
                html: data,
              };
              try {
                const info = this.transporter.sendMail(mailOptions);
              } catch (err) {
                console.error(err);
              }
            }
          });
    }
}