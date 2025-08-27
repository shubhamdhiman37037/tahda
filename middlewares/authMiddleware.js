const jwt = require("jsonwebtoken");
const Model = require("../models/index");

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.headers && req.headers.authorization;

      if (!token) {
        res.send("Token required");
      } else {
        let newToken =
          token && token.startsWith("Bearer") ? token.split(" ")[1] : token;

        const verified = jwt.verify(newToken, process.env.SECRET_KEY);

        if (verified) {
          let response = await Model.userModel.findOne({
            where: {
              id: verified.id,
            },
            raw: true,
          });

          if (!response) {
            return res.status(404).json({ message: "User not found" });
          }
          req.user = response;

          next();
        } else {
          console.log(error);
          res.status(401).json({ message: "Unauthorized access" });
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Unauthorized access" });
    }
  },
};
