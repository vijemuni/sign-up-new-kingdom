const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'huththa976@gmail.com',
    pass: 'gneb tfvb llss yazu'
  }
});

exports.sendPasswordResetEmail = async (email, resetCode) => {
  const mailOptions = {
    from: 'huththa976@gmail.com',
    to: email,
    subject: 'Password Reset',
    html: `
      <p>You requested a password reset</p>
      <p>Your password reset code is: <strong>${resetCode}</strong></p>
      <p>This code will expire in 1 hour.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};