const BaseRepository = require("./base_repository");
const Answer = require("../models/answer");

class AnswerRepository extends BaseRepository {
  constructor() {
    super(Answer);
  }
}

answerRepository = new AnswerRepository();
module.exports = answerRepository;
