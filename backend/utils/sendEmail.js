const nodemailer = require("nodemailer");

module.exports = (name,email,confirmationCode)=>{
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port:465,
      secure:true,
      service: "Gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    transport.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:4200/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => {
      console.log(err);
    });
}
