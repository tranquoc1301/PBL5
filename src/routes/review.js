const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware").verifyToken;
const isAdmin = require("../middleware/authMiddleware").isAdmin;
const isUser = require("../middleware/authMiddleware").isUser;

router.get("/", auth, reviewController.getAllReviews);
router.get(
  "/attraction/:attractionId",
  reviewController.getReviewsByAttractionId
);
router.get(
  "/restaurant/:restaurantId",
  reviewController.getReviewsByRestaurantId
);
router.post("/", auth, reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
