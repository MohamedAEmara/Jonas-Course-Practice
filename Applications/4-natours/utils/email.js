const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = process.env.EMAIL_FROM;
    }

    newTransport() {
        if(process.env.NODE_ENV === 'production') {
            // NOT IMPLEMENTED YET...
            return 1; 
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    // Send the actual email:
    async send(temlate, subject) {
        // 1- Render HTML based on pug template 
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject 
        });

        // 2- Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,               // it's passed to this funciton in Options object.
            subject,               
            html,
            text: htmlToText.htmlToText(html)
        }


        // 3- Create a transport & send emails.
        await this.newTransport().sendEmail(mailOptions)
    }

    async sendWelcom() {
        await this.send('Welcome', 'Welcome to our App :)');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 mins)');
    }
} 

const sendEmail = async options => {
    // There are 3 steps to send mails uing "nodemailer"..
     
    // // 1- Create a transporter

    // // FOR GMAIL....
    
    // const transporter = nodemailer.createTransport({
    //     // here are the options..
    //     host: 'smtp.gmail.com',
    //     port: 465, 
    //     secure: true,
    //     auth: {
    //         user: process.env.GMAIL_USERNAME,
    //         pass: process.env.GMAIL_PASSWORD
    //     }
    // });
    


    // 2- Define the email options
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: options.email,               // it's passed to this funciton in Options object.
        subject: options.subject,               
        text: options.message
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