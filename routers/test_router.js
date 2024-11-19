const router = require("express").Router();
const testController = require("../controllers/test");

router.get("/get", testController.getAllTest);

module.exports = router;
