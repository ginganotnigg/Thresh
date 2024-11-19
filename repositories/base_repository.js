const sequelize = require("../utils/database");

class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  async findById(id) {
    return await this.model.findByPk(id);
  }

  async findAll() {
    return await this.model.findAll();
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.model.findByPk(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.model.findByPk(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.destroy();
  }
}

module.exports = BaseRepository;
