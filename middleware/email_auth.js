const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kumar.jaikishan0@gmail.com',
        pass: process.env.gmail_password
    }
});

const emailmiddleware = async (req, res, next) => {
    // Define the email options
    const {name,receiver,otp}= req.body;
    const mailOptions = {
        from: 'kumar.jaikishan0@gmail.com',
        to: receiver,
        subject: 'OTP Verification-Expense Management system',
        text: `Hi ${name}, Your OTP for verification is ${otp},   Thanks for Joining Us, from Jai kishan(Developer)`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            next();
            console.log('Email sent:', info.response);
        }
    });

}
module.exports = emailmiddleware;
