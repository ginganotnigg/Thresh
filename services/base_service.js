class BaseService {
  constructor(model) {
    this.model = model;
  }

  async getById(id) {
    return await this.model.findByPk(id);
  }

  async getAll() {
    return await this.model.findAll();
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.getById(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.getById(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.destroy();
  }
}

module.exports = BaseService;
