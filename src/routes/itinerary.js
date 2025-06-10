const express = require("express");
const router = express.Router();
const itineraryController = require("../controllers/itineraryController");
const auth = require("../middleware/authMiddleware").verifyToken;
const isAdmin = require("../middleware/authMiddleware").isAdmin;

// POST /itineraries
router.get("/", auth, isAdmin, itineraryController.getAllItineraries);
router.post("/", itineraryController.createItinerary);
router.get("/id/:itinerary_id", itineraryController.getItineraryByID);
router.get(
  "/finished/:user_id",
  itineraryController.getFinishedItinerarybyUser
);
router.get(
  "/notfinished/:user_id",
  itineraryController.getNotFinishedItinerarybyUser
);
router.put("/update/:itinerary_id", itineraryController.updateItinerary);
module.exports = router;
