module.exports = {
  emailTemplate: (name, otp) => {
    return `
    <h2>Email Verification</h2>
    <p>Hi ${name},</p>
    <p>Your One-Time Password (OTP) for verification is:</p>
    <h3>${otp}</h3>
    <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;
  },
  passwordResetTemplate: (userName, resetLink) => `
  <!DOCTYPE html>
  <html>
  <body>
    <h2>Password Reset Request</h2>
    <p>Hello ${userName},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  </body>
  </html>
`,
};
