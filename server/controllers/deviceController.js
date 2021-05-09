const uuid = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../model/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    console.log(req.files, req.body);
    try {
      let { name, price, brandId, typeId, info } = req.body;
      // console.log(req.files, req.body);
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      // перемещение файла с заданным именем в нужную папку
      img.mv(path.resolve(__dirname, '..', 'static', fileName)); // __dirname - путь до текущей папки
      // raiting мы не указываем, поскольку по дефолту он равен 0
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });

      return res.status(200).json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {}

  async getOne(req, res) {}

  async delete(req, res) {}
}

module.exports = new DeviceController();
