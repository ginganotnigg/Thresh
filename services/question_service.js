const QuestionRepository = require("../repositories/question_repository");
const BaseService = require("./base_service");

class QuestionService extends BaseService {
  constructor() {
    super(QuestionRepository);
  }
}
questionService = new QuestionService();
module.exports = questionService;
