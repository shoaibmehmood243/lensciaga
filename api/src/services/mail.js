const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shoaibmehmood065@gmail.com',
    pass: 'kklc mvji ibje awgo',
  },
});

const sendMail = async (to, subject, html) => {
  const mailOptions = {
    from: 'shoaibmehmood065@gmail.com',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
};

module.exports = { sendMail };
