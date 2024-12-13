const BaseRepository = require('./base_repository');
const TestVersion = require('../models/test_version');

class TestVersionRepository extends BaseRepository {
  constructor() {
    super(TestVersion);
  }

  async getVersionsByTestId(testId) {
    return await TestVersion.findAll({
      where: { testId }
    });
  }

  async getTestID(testId) {
    return await TestVersion.findAll({
      where: { testId },
      attributes: ['ID'],
    });
  }

  async getLatestVersion(testId) {
    return await TestVersion.findOne({
      where: { testID: testId },
      order: [['createdAt', 'DESC']],
    });
  }

  async create(data) {
    return await TestVersion.create({
      testID: data.testId,
      versionNumber: data.versionNumber,
      updatedBy: data.userId,
    });
  }
}

testVersionRepository = new TestVersionRepository();
module.exports = testVersionRepository;
