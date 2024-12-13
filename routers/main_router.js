const router = require("express").Router();
const testRouter = require("./test_router.js");
const questionRouter = require("./question_router.js");
const submissionRouter = require("./submission_router.js");

router.use("/test", testRouter);
router.use("/question", questionRouter);
router.use("/submission", submissionRouter);

module.exports = router;
