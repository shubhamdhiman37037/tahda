const bcrypt = require("bcrypt");
const Joi = require("joi");
const uuid = require("uuid").v4;
const path = require("path");
const nodemailer = require("nodemailer");

module.exports = {
  validateUser: async (schema, data) => {
    try {
      return await schema.validate(data);
    } catch (error) {
      throw new Error("Validation failed");
    }
  },
  mailSender: async (mail) => {
    try {
      let Mail_SMTPAuth = true;
      let Mail_Username = "shubhamdhiman82954@gmail.com";
      let Mail_Password = "zokt bydo uesq unui";
      let Mail_SMTPSecure = "";
      let Mail_Port = "587";
      let Mail_host = "smtp.gmail.com";

      const transport = nodemailer.createTransport({
        host: Mail_host,
        port: Mail_Port,
        auth: {
          user: Mail_Username,
          pass: Mail_Password,
        },
        secure: false,
      });

      const mailOptions = {
        from: Mail_Username,
        to: mail.email,
        subject: mail.subject,
        html: mail.emailTemplate,
      };

      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err, "err==>");
          return err;
        }
        if (info) {
          console.log(info, "info");
          return info;
        }
      });
    } catch (error) {
      console.log("error while sending mail", error);
      return error;
    }
  },
  bcryptpass: async (password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      return hashedPassword;
    } catch (error) {
      console.log("error while encrypting", error);
      return res.status(500).json({ message: "error while encrypting", error });
    }
  },
  comparePassword: async (password, hashedPassword) => {
    const bcrypt = require("bcrypt");
    return await bcrypt.compare(password, hashedPassword);
  },
  success: (res, message = "", body = {}) => {
    return res.status(200).json({
      success: true,
      message: message,
      body: body,
    });
  },

  failure: (res, message = "", body = {}) => {
    return res.status(400).json({
      success: false,
      message: message,
      body: body,
    });
  },

  serverError: (res, message = "", body = {}) => {
    return res.status(500).json({
      success: false,
      message: message,
      body: body,
    });
  },
  fileUpload: async (file, folder = "uploads") => {
    try {
      if (!file || file.name === "") return null;

      // Get file extension
      let fileExtension = file.name.split(".").pop();

      // Generate unique file name using uuid
      const name = uuid() + "." + fileExtension;

      // Create the correct path by referencing 'public/images' folder
      const filePath = path.join(__dirname, "..", "public", folder, name);

      // Move the file to the desired folder
      file.mv(filePath, (err) => {
        if (err) throw err;
      });

      // Return the file path relative to the public folder (this will be accessible via URL)
      return `/uploads/${name}`;
    } catch (error) {
      console.error("Error during file upload:", error);
      return null;
    }
  },
};
