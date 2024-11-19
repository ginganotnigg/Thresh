const router = require("express").Router();
const questionController = require("../controllers/question");

router.get("/get", questionController.getAllQuestion);

module.exports = router;
