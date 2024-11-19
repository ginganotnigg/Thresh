const router = require("express").Router();
const submissionController = require("../controllers/submission");

router.get("/get", submissionController.getAllSubmission);

module.exports = router;
