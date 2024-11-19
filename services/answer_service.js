const AnswerRepository = require("../repositories/answer_repository");
const BaseService = require("./base_service");

class AnswerService extends BaseService {
  constructor() {
    super(AnswerRepository);
  }
}
answerService = new AnswerService();
module.exports = answerService;
