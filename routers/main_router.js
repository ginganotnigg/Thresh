const router = require("express").Router();
const testRouter = require("./test_router.js");

router.use("/test", testRouter);

module.exports = router;
