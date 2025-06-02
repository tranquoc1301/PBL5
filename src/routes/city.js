const express = require("express");
const router = express.Router();
const CityController = require("../controllers/cityController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", CityController.getAllCities);
router.get("/:id", CityController.getCityById);
router.post("/upload", upload.array("images", 10), CityController.uploadImages);
router.post("/", CityController.createCity);
router.get("/search/:name", CityController.getCityByName);
router.put("/:id", CityController.updateCity);
router.delete("/:id", CityController.deleteCity);

module.exports = router;
