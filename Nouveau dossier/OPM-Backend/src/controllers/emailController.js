const nodemailer = require('nodemailer');
require('dotenv').config();
const emailController = require('./emailController');

exports.nodeMal = async (req, res, receiver, subject, content) => {
    try {
        const emailSender ="OPM.Dev@outlook.fr"
        const passwordSender ="14265401dD@"
        const transporter = nodemailer.createTransport({
            service: "outlook",
            port: 587,
            auth: {
                user: emailSender,
                pass: passwordSender,
            },
        });

        const mailOptions = {
            from:emailSender,
            to: receiver,
            subject: subject,
            text: content,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ err: true, message: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ err: false, message: "Email sendet" });
                res.send({ email: sender });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while sending the email.");
    }
};