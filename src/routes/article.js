const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.post("/", articleController.create);
router.get("/", articleController.getAll);
router.get("/:id", articleController.getById);
router.put("/:id", articleController.update);
router.delete("/:id", articleController.remove);

module.exports = router;
