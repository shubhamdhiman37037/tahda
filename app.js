const express = require("express");
require("dotenv").config();
require("./config/DBconnect").connectDB();
const userRouter = require("./routers/userRoute");
const path = require("path");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api", userRouter);
app.get("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  res.render("resetPass", { token });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
