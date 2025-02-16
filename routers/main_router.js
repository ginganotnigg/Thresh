const router = require("express").Router();
const candidateRouter = require("./candidate_router.js");
const managerRouter = require("./manager_router.js");
const noauthRouter = require("./noauth_router.js");
const { authorize, Role } = require("./helpers/auth_handler.js");

router.use(noauthRouter);
router.use(authorize(Role.CANDIDATE), candidateRouter);
router.use(authorize(Role.BUSINESS_MANAGER), managerRouter);

module.exports = router;
