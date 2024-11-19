const router = require("express").Router();
const testRouter = require("./test_router.js");
const questionRouter = require("./question_router.js");
const submissionRouter = require("./submission_router.js");

// const {
//   getTests,
//   getTestById,
//   submitTest,
// } = require("../controllers/main_controller.js");

// router.get("/", getTests);
// router.get("/id", getTestById);
// router.post("/id/submit", submitTest);

router.use("/test", testRouter);
router.use("/question", questionRouter);
router.use("/submission", submissionRouter);

module.exports = router;
