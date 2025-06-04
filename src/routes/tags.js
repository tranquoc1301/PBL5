const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const express = require("express");
const { classifyTag } = require("../utils/tagClassifier");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Lấy tất cả tags từ attractions và restaurants
    const tags = await sequelize.query(
      `SELECT DISTINCT tag, category
       FROM (
         SELECT jsonb_array_elements_text(tags) as tag, 'attractions' as category
         FROM attractions
         WHERE tags IS NOT NULL
         UNION
         SELECT jsonb_array_elements_text(tags) as tag, 'restaurants' as category
         FROM restaurants
         WHERE tags IS NOT NULL
       ) AS combined_tags
       ORDER BY category, tag`,
      { type: QueryTypes.SELECT }
    );

    // Phân loại tags
    const categorizedTags = {
      Attractions: [],
      Activities: [],
      Entertainment: [],
      Services: [],
      Other: [],
      Restaurant: [],
    };

    tags.forEach(({ tag, category }) => {
      if (category === "restaurants") {
        categorizedTags.Restaurant.push(tag);
      } else {
        const classifiedCategory = classifyTag(tag);
        categorizedTags[classifiedCategory].push(tag);
      }
    });

    // Sắp xếp tags trong mỗi danh mục
    Object.keys(categorizedTags).forEach((category) => {
      categorizedTags[category].sort();
    });

    res.json(categorizedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch tags", details: error.message });
  }
});

router.get("/attractions", async (req, res) => {
  try {
    const attractions = await sequelize.query(
      `SELECT DISTINCT jsonb_array_elements_text(tags) as tag
       FROM attractions
       WHERE tags IS NOT NULL`,
      { type: QueryTypes.SELECT }
    );

    const tags = attractions.map((item) => item.tag).sort();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching attraction tags:", error);
    res.status(500).json({
      error: "Failed to fetch attraction tags",
      details: error.message,
    });
  }
});
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await sequelize.query(
      `SELECT DISTINCT jsonb_array_elements_text(tags) as tag
       FROM restaurants
       WHERE tags IS NOT NULL`,
      { type: QueryTypes.SELECT }
    );

    const tags = restaurants.map((item) => item.tag).sort();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching restaurant tags:", error);
    res.status(500).json({
      error: "Failed to fetch restaurant tags",
      details: error.message,
    });
  }
});

module.exports = router;
