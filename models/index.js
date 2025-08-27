const Sequelize = require("sequelize");
const cartModel = require("./cartModel");
const favModel = require("./favModel");
const bookingsModel = require("./bookingsModel");
const reportModel = require("./reportModel");
const contactUsModel = require("./contactUsModel");
const surveyModel = require("./surveyModel");
const answersModel = require("./answersModel");
const sequelize = require("../config/DBconnect").sequelize;
module.exports = {
  userModel: require("../models/userModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  categoryModel: require("../models/categoryModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  subCategoryModel: require("../models/subCategoryModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  cartModel: require("../models/cartModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  shippingAddressModel: require("../models/shippingAddressModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  orderModel: require("../models/orderModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  subOrdersModel: require("../models/subOrdersModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  favModel: require("../models/favModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  bookingsModel: require("../models/bookingsModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  reportModel: require("../models/reportModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  reviewModel: require("../models/reviewModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  productModel: require("../models/productModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  contactUsModel: require("../models/contactUsModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  surveyModel: require("../models/surveyModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
  answersModel: require("../models/answersModel")(
    Sequelize,
    sequelize,
    Sequelize.DataTypes
  ),
};
