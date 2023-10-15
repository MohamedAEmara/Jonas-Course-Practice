const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // There are 3 steps to send mails uing "nodemailer"..
     
    // 1- Create a transporter

    // FOR GMAIL....
    
    const transporter = nodemailer.createTransport({
        // here are the options..
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });
    


    // 2- Define the email options
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: process.env.TO,               // it's passed to this funciton in Options object.
        subject: '❌HACKER❌',               
        text: 'تخافش بهزر معاك'
    }

    console.log(mailOptions);
    // 3- Send the email with nodemailer
    const info = transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err, 'error');
        } else {
            console.log('mail sent 😊', info);
        }
    });


    console.log(info);


}   

// sendEmail.catch(err => console.log(err));




module.exports = sendEmail;