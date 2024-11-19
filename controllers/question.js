const questionService = require("../services/question_service");

async function getAllQuestion(req, res) {
  return res.json(await questionService.getAll());
}

module.exports = { getAllQuestion };
