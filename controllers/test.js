const testService = require("../services/test_service");

async function getAllTest(req, res) {
  return res.json(await testService.getAll());
}

module.exports = { getAllTest };
