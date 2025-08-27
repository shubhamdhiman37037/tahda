const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");
const surveyController = require("../controllers/surveyController");

router.post("/signup", userController.userSignup);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/login", userController.userLogin);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPasswordWithToken);
router.get("/userDetail", authenticate, userController.userDetail);
router.post("/addCategory", userController.addCategory);
router.get("/getCategories", userController.getCategories);
router.post("/addSubCategory", userController.addSubCategory);
router.post("/addProduct", userController.addProduct);
router.get("/getSubCategories", userController.getSubcategory);

router.get(
  "/getProducts/:subCategoryId",
  userController.getProductsBySubcategoryId
);

router.get("/getProductDetail/:productId", userController.getProductDetail);
router.post("/addToCart", authenticate, userController.addToCart);
router.get("/getCart", authenticate, userController.getCartProducts);
router.delete(
  "/removeFromCart/:productId",
  authenticate,
  userController.removeCartProduct
);
router.post(
  "/addShippingAddress",
  authenticate,
  userController.addShippingAddress
);
router.get(
  "/getShippingAddresses",
  authenticate,
  userController.getShippingAddresses
);
router.delete(
  "/deleteShippingAddress/:addressId",
  authenticate,
  userController.deleteShippingAddress
);
router.post("/checkout", authenticate, userController.checkoutItem);
router.post("/changePassword", authenticate, userController.changePassword);
router.post("/getNearest", userController.getNearest);
router.get("/getNearestUser", userController.getNearestUser);
router.post("/favourite", authenticate, userController.favourite);
router.get("/favouriteList", authenticate, userController.getFavourites);
router.post("/bookings", authenticate, userController.bookings);
router.post("/reports", authenticate, userController.userReport);
router.get("/getReports", authenticate, userController.getUserReports);
router.delete("/cancleBooking", authenticate, userController.cancleBooking);
router.get("/myBookings", authenticate, userController.myBookings);
router.get("/bookingDetail", authenticate, userController.bookingDetail);
router.post("/review", authenticate, userController.reviews);
router.get("/getReviews", authenticate, userController.getReviews);
router.get("/getOrders", authenticate, userController.getOrders);
router.get("/orderDetail", authenticate, userController.getOrderDetail);
router.put("/updateProfile", authenticate, userController.updateProfile);
router.post("/contactUs", authenticate, userController.contactUs);
router.post("/questions", surveyController.surveyQuestions);
router.post("/answers", authenticate, surveyController.answers);
module.exports = router;
