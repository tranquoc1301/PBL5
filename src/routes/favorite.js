const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/favoriteController");

router.post("/", FavoriteController.createFavorite);
router.delete("/:favorite_id", FavoriteController.deleteFavorite);
router.get("/user/:user_id", FavoriteController.getFavoritesByUser);

module.exports = router;
