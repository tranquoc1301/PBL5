const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    logging: false,
  }
);
const ReviewModel = require("../models/review");
const Review = ReviewModel(sequelize);
const { Op } = require("sequelize");
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getReviewById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const review = await Review.findByPk(id);
//     if (review) {
//       res.json(review);
//     } else {
//       res.status(404).json({ message: 'Review not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getReviewsByLocation = async (req, res) => {
//   try {
//     const { location_id } = req.params;

//     // Kiểm tra location_id có hợp lệ không
//     if (!location_id || isNaN(location_id)) {
//       return res.status(400).json({ error: "Invalid location_id" });
//     }

//     // Truy vấn các review theo location_id
//     const reviews = await Review.findAll({
//       where: { location_id: location_id },
//     });

//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getReviewsByAttractionId = async (req, res) => {
  try {
    const { attraction_id } = req.params;

    if (!attraction_id|| isNaN(attraction_id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const reviews = await Review.findAll({
      where: {
        attraction_id : attraction_id
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByRestaurantId = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    if (!restaurant_id|| isNaN(restaurant_id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const reviews = await Review.findAll({
      where: {
        restaurant_id : restaurant_id
      },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Validation Error:", error.errors);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Review.update(req.body, {
      where: { review_id: id },
    });
    if (updated) {
      const updatedReview = await Review.findByPk(id);
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.destroy({
      where: { review_id: id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
