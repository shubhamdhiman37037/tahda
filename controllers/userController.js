const Model = require("../models/index");
const { Op, Sequelize, literal } = require("sequelize");
const moment = require("moment");
Model.cartModel.belongsTo(Model.productModel, {
  foreignKey: "productId",
});

Model.favModel.belongsTo(Model.userModel, {
  foreignKey: "favId",
  as: "favourit",
});

Model.bookingsModel.belongsTo(Model.userModel, {
  foreignKey: "bookedTo",
});

Model.subOrdersModel.belongsTo(Model.orderModel, {
  foreignKey: "orderId",
});

Model.subOrdersModel.belongsTo(Model.productModel, {
  foreignKey: "productId",
});

const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {
  validateUser,
  mailSender,
  success,
  failure,
  comparePassword,
  bcryptpass,
  serverError,
  fileUpload,
} = require("../helpers/commonHelper");
const { err, failures, successe } = require("../helpers/response");
const { sign } = require("jsonwebtoken");
const emailTemp = require("../helpers/emailTemp");

module.exports = {
  userSignup: async (req, res) => {
    try {
      const schema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        lat: Joi.number().required(),
        long: Joi.number().required(),
        location: Joi.string().required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { firstName, lastName, email, password, lat, long, location } =
        req.body;
      const existingUser = await Model.userModel.findOne({ where: { email } });
      if (existingUser) {
        return failure(res, failures.userExists);
      }

      const hashedPassword = await bcryptpass(password);
      const user = await Model.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        lat,
        long,
        location,
      });

      const otp = Math.floor(100000 + Math.random() * 900000);

      mailSender({
        email: user.email,
        subject: "OTP Verification",
        emailTemplate: emailTemp.emailTemplate(user.firstName, otp),
      });
      user.otp = otp;
      await user.save();

      success(res, successe.userSave, user);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().integer().min(100000).max(999999).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const user = await Model.userModel.findOne({ where: { email } });
      if (!user) {
        return failure(res, failures.user);
      }
      if (user.otp !== otp) {
        return failure(res, failures.otp);
      }
      user.isVerified = true;
      user.otp = null;
      await user.save();
      const token = sign({ id: user.id }, process.env.SECRET_KEY);
      user.token = token;
      await user.save();

      success(res, successe.logged, { token, user });
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  userLogin: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { email, password } = req.body;
      const user = await Model.userModel.findOne({ where: { email } });
      if (!user) {
        return failure(res, failures.user);
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return failure(res, failures.invalid);
      }
      const token = sign({ id: user.id }, process.env.SECRET_KEY);
      user.token = token;
      await user.save();

      success(res, successe.logged, token);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { email } = req.body;
      const user = await Model.userModel.findOne({ where: { email } });
      if (!user) {
        return failure(res, failures.user);
      }
      const resetToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "15m",
      });
      const resetLink = `${process.env.URL}/reset-password/${resetToken}`;
      mailSender({
        email: user.email,
        subject: "Password Reset",
        emailTemplate: emailTemp.passwordResetTemplate(
          user.firstName,
          resetLink
        ),
      });

      success(res, successe.resetLink);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  resetPasswordWithToken: async (req, res) => {
    try {
      const { token } = req.params;

      const schema = Joi.object({
        password: Joi.string().min(6).max(150).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await Model.userModel.findByPk(decoded.id);
      if (!user) {
        failure(res, failure.user);
      }

      user.password = await bcryptpass(req.body.password);
      await user.save();
      success(res, success.passwordChange);
    } catch (error) {
      console.log(error);
      serverError(res, err, error);
    }
  },
  userDetail: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await Model.userModel.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return failure(res, failures.notFound);
      }
      res.status(200).json({ user });
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const schema = Joi.object({
        oldPassword: Joi.string().min(6).max(150).required(),
        newPassword: Joi.string().min(6).max(150).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const user = await Model.userModel.findByPk(userId);
      if (!user) {
        return failure(res, failures.user);
      }
      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        return failure(res, failures.invalid);
      }
      user.password = await bcryptpass(newPassword);
      await user.save();

      success(res, successe.passwordChange);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  addCategory: async (req, res) => {
    try {
      const schema = Joi.object({
        title: Joi.string().min(2).max(100).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      let file = req.files.file;

      if (!file) {
        return failure(res, failures.files);
      }

      const path = await fileUpload(file);

      const { title } = req.body;
      const category = await Model.categoryModel.create({ title, image: path });
      res.status(201).json({ category });
    } catch (error) {
      serverError(res, err.server);
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Model.categoryModel.findAll();

      success(res, successe.getCategory, categories);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  addSubCategory: async (req, res) => {
    try {
      const schema = Joi.object({
        categoryId: Joi.string().required(),
        title: Joi.string().min(2).max(100).required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      let file = req.files.file;

      if (!file) {
        return failure(res, failures.files);
      }

      const path = await fileUpload(file);

      const { title, categoryId } = req.body;
      const category = await Model.subCategoryModel.create({
        categoryId,
        title,
        image: path,
      });
      res.status(201).json({ category });
    } catch (error) {
      serverError(res, err.server);
    }
  },
  addProduct: async (req, res) => {
    try {
      const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(0).required(),
        subCategoryId: Joi.string().uuid().required(),
      });
      const { error } = validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }

      let file = req.files.file;

      if (!file) {
        return failure(res, failures.files);
      }

      const path = await fileUpload(file);
      const { name, price, quantity, subCategoryId } = req.body;
      const subCategory = await Model.productModel.create({
        subCategoryId,
        name,
        price,
        quantity,
        image: path,
      });

      success(res, successe.createSubCate, subCategory);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  getSubcategory: async (req, res) => {
    try {
      const subCategories = await Model.subCategoryModel.findAll();

      success(res, successe.getSubCate, subCategories);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  getProductsBySubcategoryId: async (req, res) => {
    try {
      const subCategoryId = req.params.subCategoryId;
      if (!subCategoryId) {
        return failure(res, failures.notFound);
      }
      const products = await Model.productModel.findAll({
        where: { products },
      });

      success(res, successe.products, products);
    } catch (error) {
      console.log(error);
      serverError(res, err.server, error);
    }
  },
  getProductDetail: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Model.productModel.findOne({
        where: { id: productId },
      });
      if (!product) {
        return failure(res, failures.Product);
      }
      res.status(200).json({ product });
    } catch (error) {
      serverError(res, err.server);
    }
  },
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user.id;

      const product = await Model.productModel.findOne({
        where: { id: productId },
      });
      if (!product) {
        return failure(res, failures.Product);
      }

      const cartItem = await Model.cartModel.findOne({
        where: { userId, productId },
      });
      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await Model.cartModel.create({
          userId,
          productId,
          quantity,
        });
      }

      success(res, successe.productadd);
    } catch (error) {
      console.log(error);
      serverError(res, err.server);
    }
  },
  getCartProducts: async (req, res) => {
    try {
      const userId = req.user.id;
      const cartItems = await Model.cartModel.findAll({
        where: { userId },
        include: [{ model: Model.productModel }],
      });

      success(res, successe.cartProduct, cartItems);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  removeCartProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id;

      const cartItem = await Model.cartModel.findOne({
        where: { userId, productId },
      });
      if (!cartItem) {
        return failure(res, failures.notFound);
      }

      await cartItem.destroy();

      success(res, successe.remove);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  addShippingAddress: async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        firstName,
        lastName,
        address,
        apartments,
        city,
        state,
        postalCode,
        country,
        phone,
        countryCode,
      } = req.body;

      const newAddress = await Model.shippingAddressModel.create({
        userId,
        firstName,
        lastName,
        address,
        apartments,
        city,
        state,
        postalCode,
        country,
        phone,
        countryCode,
      });

      success(res, successe.newAdd, newAddress);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  getShippingAddresses: async (req, res) => {
    try {
      const userId = req.user.id;
      const addresses = await Model.shippingAddressModel.findAll({
        where: { userId },
      });

      success(res, successe.getAdd, addresses);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  deleteShippingAddress: async (req, res) => {
    try {
      const { addressId } = req.params;
      const userId = req.user.id;

      const address = await Model.shippingAddressModel.findOne({
        where: { id: addressId, userId },
      });
      if (!address) {
        return failure(res, failures.notFound);
      }

      await address.destroy();

      success(res, successe.deleted);
    } catch (error) {
      serverError(res, err.server);
    }
  },
  checkoutItem: async (req, res) => {
    try {
      const schema = Joi.object({
        totalPrice: Joi.number().required(),
        totalItems: Joi.number().required(),

        addressId: Joi.string().required(),
        cartProducts: Joi.array().required(),
      });
      const { error } = schema.validateUser(schema, req.body);

      if (error) {
        return failure(res, failures.invalid);
      }
      const userId = req.user.id;

      const { totalPrice, totalItems, cartProducts, addressId } = req.body;

      const item = await Model.orderModel.create({
        totalPrice,
        totalItems,
        userId,
        addressId,
      });
      let orderId = item.id;

      for (const product of cartProducts) {
        await Model.subOrdersModel.create({
          orderId: orderId,
          productId: product.productId,
          productQuantity: product.quantity,
          price: product.price,
        });
      }

      success(res, successe.products);
    } catch (error) {
      console.log(error);
      serverError(res, err.server);
    }
  },
  getNearest: async (req, res) => {
    try {
      const schema = Joi.object({
        lat: Joi.number().required(),
        long: Joi.number().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }

      const { lat, long } = req.body;

      const distance = Sequelize.literal(`
  6371 * acos(
    LEAST(1, GREATEST(-1,
      cos(radians(${lat})) * cos(radians(\`lat\`)) *
      cos(radians(\`long\`) - radians(${long})) +
      sin(radians(${lat})) * sin(radians(\`lat\`))
    ))
  )
`);

      const locations = await Model.userModel.findAll({
        attributes: {
          include: [[distance, "distance"]],
        },
        having: literal("distance < 21"),
        order: Sequelize.literal("distance ASC"),
      });
      return success(res, successe.signUp, locations);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getNearestUser: async (req, res) => {
    try {
      const schema = Joi.object({
        userId: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }

      const { userId } = req.body;
      const user = await Model.userModel.findOne({ where: { id: userId } });
      success(res, successe.userDetail, user);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  favourite: async (req, res) => {
    try {
      const schema = Joi.object({
        favId: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }

      userId = req.user.id;
      if (!userId) {
        return failure(res, failures.user);
      }
      const { favId } = req.body;
      const found = await Model.favModel.findOne({ where: { favId } });
      if (found) {
        return failure(res, failures.userExists);
      }
      const user = await Model.favModel.create({ userId, favId });
      success(res, successe.favourite, user);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getFavourites: async (req, res) => {
    try {
      const userId = req.user.id;

      const users = await Model.favModel.findAll({
        where: { userId },
        include: [{ model: Model.userModel, as: "favourit" }],
      });
      success(res, successe.favouriteList, users);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  bookings: async (req, res) => {
    try {
      const schema = Joi.object({
        bookedTo: Joi.string().required(),
        date: Joi.date().required(),
        time: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }

      bookedBy = req.user.id;

      if (!bookedBy) {
        return failure(res, failures.user);
      }
      const { bookedTo, date, time } = req.body;
      const book = await Model.bookingsModel.findOne({ where: { bookedTo } });
      if (book) {
        return failure(res, failures.userExists);
      }
      const booking = await Model.bookingsModel.create({
        bookedBy,
        bookedTo,
        date,
        time,
      });
      success(res, successe.booked, booking);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  userReport: async (req, res) => {
    try {
      let file = req.files.file;
      if (!file) {
        return failure(res, failures.image);
      }
      if (!Array.isArray(file)) {
        file = [file];
      }
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.user);
      }
      for (let i = 0; i < file.length; i++) {
        const image = await fileUpload(file[i]);
        await Model.reportModel.create({ userId, image });
      }
      success(res, successe.documents);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getUserReports: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.user);
      }
      const users = await Model.reportModel.findAll({ where: { userId } });
      success(res, successe.report, users);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  cancleBooking: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.user);
      }
      const schema = Joi.object({
        id: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { id } = req.body;
      const user = await Model.bookingsModel.destroy({
        where: { id, bookedBy: userId },
      });
      success(res, successe.deleted, user);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  myBookings: async (req, res) => {
    try {
      const bookedBy = req.user.id;
      if (!bookedBy) {
        return failure(res, failures.user);
      }
      const users = await Model.bookingsModel.findAll({
        where: { bookedBy },
        include: [{ model: Model.userModel }],
      });
      success(res, successe.myBooking, users);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  bookingDetail: async (req, res) => {
    try {
      const schema = Joi.object({
        bookedTo: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { bookedTo } = req.body;
      const bookedBy = req.user.id;

      if (!bookedBy) {
        return failure(res, failures.user);
      }
      const booking = await Model.bookingsModel.findOne({
        where: { bookedTo, bookedBy },
        include: [{ model: Model.userModel }],
      });
      success(res, successe.details, booking);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  reviews: async (req, res) => {
    try {
      const schema = Joi.object({
        ratedTo: Joi.string().required(),
        rating: Joi.number().required(),
        review: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const ratedBy = req.user.id;
      if (!ratedBy) {
        return failure(res, failures.user);
      }
      const { ratedTo, rating, review } = req.body;
      const rev = await Model.reviewModel.create({
        ratedBy,
        ratedTo,
        rating,
        review,
      });
      success(res, successe.review, rev);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getReviews: async (req, res) => {
    try {
      const schema = Joi.object({
        ratedTo: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { ratedTo } = req.body;
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.notFound);
      }
      const reviews = await Model.reviewModel.findAll({ where: { ratedTo } });
      success(res, successe.fetchReview, reviews);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getOrders: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return failure(res, failures.notFound);
      }
      const { filter } = req.body;
      let abc = { userId };
      let today = moment();

      if (filter == "This month") {
        abc.createdAt = {
          [Op.between]: [
            today.startOf("month").toDate(),
            today.endOf("month").toDate(),
          ],
        };
      } else if (filter == "Last month") {
        let lastMonth = moment().subtract(1, "month");
        abc.createdAt = {
          [Op.between]: [
            lastMonth.startOf("month").toDate(),
            lastMonth.endOf("month").toDate(),
          ],
        };
      } else if (filter === "This year") {
        const currentYear = moment();
        abc.createdAt = {
          [Op.between]: [
            currentYear.startOf("year").toDate(),
            currentYear.endOf("year").toDate(),
          ],
        };
      }

      const orders = await Model.subOrdersModel.findAll({
        include: [
          { model: Model.productModel, attributes: ["name"] },
          {
            model: Model.orderModel,
            attributes: ["userId"],
            where: abc,
            required: true,
          },
        ],
      });
      success(res, successe.order, orders);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  getOrderDetail: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return failure(res, failures.notFound);
      }
      const schema = Joi.object({
        orderId: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { orderId } = req.body;
      const order = await Model.subOrdersModel.findOne({
        where: { orderId },
        include: [{ model: Model.productModel, attributes: ["name"] }],
      });
      success(res, successe.getCategory, order);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const schema = Joi.object({
        fullName: Joi.string().required(),
        mobileNo: Joi.string().required(),
        email: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const id = req.user.id;
      if (!id) {
        return failure(res, failures.notFound);
      }
      const { fullName, email, mobileNo } = req.body;
      const Name = fullName.split(" ");
      if (Name.length < 2) {
        return failure(res, failures.notFound);
      }
      let firstName = Name[0];
      let lastName = Name.slice(1).join(" ");

      const user = await Model.userModel.update(
        { firstName, lastName, email, mobileNo },
        { where: { id } }
      );
      success(res, successe.updateProfile, user);
    } catch (error) {
      console.log(error);
      serverError(res, err.server, error);
    }
  },
  contactUs: async (req, res) => {
    try {
      const schema = Joi.object({
        title: Joi.string().required(),
        email: Joi.string().required(),
        message: Joi.string().required(),
      });
      const { error } = schema.validateUser(schema, req.body);
      if (error) {
        return failure(res, failures.invalid);
      }
      const { title, email, message } = req.body;
      const user = await Model.contactUsModel.create({ title, email, message });
      success(res, successe.contactUs, user);
    } catch (error) {
      serverError(res, err.server, error);
    }
  },
};
