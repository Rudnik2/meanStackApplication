const nodemailer = require("nodemailer");

module.exports = (name,email,resetPasswordToken)=>{

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
      subject: "Reset your password",
      html: `<h1>Resetowanie hasła</h1>
          <h2>Cześć ${name}</h2>
          <p>Widzimy, że chcesz zmienić swoje hasło. Proszę kliknij w link poniżej:</p>
          <a href=http://localhost:4200/response-reset-password/${resetPasswordToken}> Click here</a>
          <p>Jeśli nie chciałeś zmieniać hasła, proszę zignoruj tego maila</p>
          </div>`,
    }).catch(err => {
      console.log(err);
    });
}
