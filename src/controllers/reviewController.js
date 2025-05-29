const { Sequelize } = require("sequelize");
const ReviewService = require("../services/reviewService");

const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    logging: false,
  }
);

const reviewService = new ReviewService(sequelize);

class ReviewController {
  async getAllReviews(req, res) {
    try {
      const reviews = await reviewService.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReviewsByAttractionId(req, res) {
    try {
      const { attractionId } = req.params;
      const reviews = await reviewService.getReviewsByAttractionId(
        attractionId
      );
      res.json(reviews);
    } catch (error) {
      res
        .status(error.message.includes("Invalid") ? 400 : 500)
        .json({ error: error.message });
    }
  }

  async getReviewsByRestaurantId(req, res) {
    try {
      const { restaurantId } = req.params;
      const reviews = await reviewService.getReviewsByRestaurantId(
        restaurantId
      );
      res.json(reviews);
    } catch (error) {
      res
        .status(error.message.includes("Invalid") ? 400 : 500)
        .json({ error: error.message });
    }
  }

  async createReview(req, res) {
    try {
      const newReview = await reviewService.createReview(req.body);
      res.status(201).json(newReview);
    } catch (error) {
      res
        .status(error.message.includes("authentication") ? 401 : 400)
        .json({ error: error.message });
    }
  }

  async updateReview(req, res) {
    try {
      const { id } = req.params;
      const updatedReview = await reviewService.updateReview(
        id,
        req.body.user_id,
        req.body
      );
      res.json(updatedReview);
    } catch (error) {
      res
        .status(
          error.message.includes("Unauthorized")
            ? 403
            : error.message.includes("not found")
            ? 404
            : 400
        )
        .json({ error: error.message });
    }
  }

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      await reviewService.deleteReview(id, req.body.user_id);
      res.status(204).send();
    } catch (error) {
      res
        .status(
          error.message.includes("Unauthorized")
            ? 403
            : error.message.includes("not found")
            ? 404
            : 500
        )
        .json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();
