const express = require("express");
const router = express.Router();
const { User, Questions, Language, Exercise } = require("../models");
router.use("/user", require("./user"));
router.use('/quiz', require('./quiz'));
router.use('/admin', require('./admin'));
router.use('/leaderboard', require('./leaderboard'));

module.exports = router;
