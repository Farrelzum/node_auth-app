const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendActivationEmail = async (to, token) => {
  try {
    const info = await transporter.sendMail({
      from: '"Example Team" <team@example.com>',
      to: to,
      subject: 'Activation link',
      text: `To activate your account click the link: http://localhost:3000/api/auth/activate/${token}`,
      html: `<a href="http://localhost:3000/api/auth/activate/${token}">Click here to activate your account</a>`,
    });

    // eslint-disable-next-line no-console
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error while sending mail:', err);
  }
};

module.exports = sendActivationEmail;
