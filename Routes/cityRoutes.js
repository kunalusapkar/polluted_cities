const express = require("express");
const router = express.Router();
const cityController = require("../Controller/cityController");

// router.route("/create").get(cityController.createPollutedCities);
router.route("/").get(cityController.getPollutedCities);

module.exports = router;
