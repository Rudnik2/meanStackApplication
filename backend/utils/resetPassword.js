const nodemailer = require("nodemailer");

module.exports = (name, email, resetPasswordToken) => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  transport
    .sendMail({
      from: process.env.USER,
      to: email,
      subject: "Reset your password",
      html: `<h1>Reset password</h1>
          <h2>Hi ${name}</h2>
          <p>To reset your password please click link below:</p>
          <a href=http://rudnik2-to-do-app.s3-website.eu-north-1.amazonaws.com/response-reset-password/${resetPasswordToken}> Click here</a>
          </div>`,
    })

    .catch((err) => {
      console.log(err);
    });
};
