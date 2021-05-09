const { Type } = require('../model/models.js');
const ApiError = require('../error/ApiError');

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    return res.json(type);
  }

  async getAll(req, res) {
    // вернет все существующие записи, которые есть в бд, не забываем о том, что запросы должны быть асинхронными - поэтому await
    const types = await Type.findAll();
    return res.json(types);
  }
}

module.exports = new TypeController();
