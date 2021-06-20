const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendActivationMail = async (to, activationLink) => {
  await mailTransporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `Account activation on ${process.env.CLIENT_URL}`,
    text: "",
    html: `
      <div>
        <p>
          To activate follow 
          <a href="${`${process.env.CLIENT_URL}/activate?activationLink=${activationLink}`}">link</a>
        </p>
      </div>
    `
  });
};