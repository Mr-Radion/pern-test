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
      console.log(img.mv(path.resolve(__dirname, '..', 'static', fileName)))
      img.mv(path.resolve(__dirname, '..', 'static', fileName)); // __dirname - путь до текущей папки
      // raiting мы не указываем, поскольку по дефолту он равен 0
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });

    // реализуем перебор массива с информацией о девайсах
    // когда мы передаем данные через formdata они у нас приходят в форме строки, поэтому надо парсить на фронте в json строкуЮ 
    // а на бэке обратно перегонять в javascript объекты с помощью json.parse
    // далее каждый объект сохраняет в бд, но без await намеренно, чтобы во время перебора не блокировать весь поток, пусть они создаются 
    // "где-то" асинхронно, ибо мы должны еще до этой функции получить id девайса из функции device, без него не вариант создать описание 

      return res.status(200).json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    // limit это кол-во девайсов, которые будут отображаться на 1 странице(по дефолту будем отправлять по 9 устройств для каждой стр), 
    // а page это конкретная страница(по дефолту 1, если не указан), 
    // чтобы при указании стр совершался пропуск/отступ страниц до отступ offset нужно посчитать, 
    // чтобы посчитать кол-во страниц на фронте, надо вернуть в ответе общее кол-во товаров, для этого есть функция для пагинации findAndCountAll
    let { brandId, typeId, limit, page } = req.body;

    // реализуем фильтрацию
  }

  async getOne(req, res) {
    // includes для подгрузки характеристик их объекта, а as - название поля которое будет в этом объекте, 
    // т.е этого поля info в самой бд нету, и мы в json объекте отправим его вместе с типовыми данными из модели Device из бд
    // свойство info: [] будет пустым, если его не добавляли при создании
  }

  async delete(req, res) {}
}

module.exports = new DeviceController();
