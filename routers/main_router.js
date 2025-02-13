const router = require("express").Router();
const candidateRouter = require("./candidate_router.js");
const managerRouter = require("./manager_router.js");
const noauthRouter = require("./noauth_router.js");
const { authorize, Role } = require("./helpers/auth_handler.js");

router.use("/test", noauthRouter);
router.use("/candidate/test", authorize(Role.CANDIDATE), candidateRouter);
router.use("/manager/test", authorize(Role.BUSINESS_MANAGER), managerRouter);

module.exports = router;
