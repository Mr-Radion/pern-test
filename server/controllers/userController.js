const ApiError = require('../error/ApiError');

class UserController {
  async registration(req, res) {}

  async login(req, res) {}

  async check(req, res, next) {
    const {id} = req.query;
    if(!id) {
      // next передает управление указанному внутри другому классу, в данном случае это способ нашей пользовательской обработки ошибок
      return next(ApiError.badRequest('Не задан ID'))
    }
    res.json(id)
  }
}

module.exports = new UserController();
