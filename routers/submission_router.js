const router = require("express").Router();
const submissionController = require("../controllers/submission_controller");

router.get("/list", submissionController.listSubmissions); // List submissions
router.get("/get/:id", submissionController.getSubmissionById);

module.exports = router;
