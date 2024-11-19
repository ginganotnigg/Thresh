const BaseRepository = require("./base_repository");
const Question = require("../models/question");

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }
}

questionRepository = new QuestionRepository();
module.exports = questionRepository;
