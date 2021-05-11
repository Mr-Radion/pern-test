const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Device, DeviceInfo } = require('../model/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json('No files were uploaded.');
      }
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      // raiting мы не указываем, поскольку по дефолту он равен 0
      const device = await Device.create({ name, price, brandId, typeId, img: fileName });
      // перемещение файла с заданным именем в нужную папку, для этого используется метод из пакета работы с файлами express-fileupload
      // подробнее https://www.npmjs.com/package/express-fileupload или https://github.com/richardgirges/express-fileupload/tree/master/example
      img.mv(path.resolve(__dirname, '..', 'static', fileName)); // __dirname - путь до текущей папки
      // реализуем перебор массива с информацией о девайсах
      // когда мы передаем данные через formdata они у нас приходят в форме строки, поэтому надо парсить на фронте в json строкуЮ
      // а на бэке обратно перегонять в javascript объекты с помощью json.parse
      // далее каждый объект сохраняет в бд, но без await намеренно, чтобы во время перебора не блокировать весь поток, пусть они создаются
      // "где-то" асинхронно, ибо мы должны еще до этой функции получить id девайса из функции device, без него не вариант создать описание
      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          DeviceInfo.create({
            title: i.title,
            decription: i.decription,
            deviceId: device.id,
          });
        });
      }

      return res.status(200).json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    // limit это кол-во девайсов, которые будут отображаться на 1 странице(по дефолту будем отправлять по 9 устройств для каждой стр),
    // а page это конкретная страница(по дефолту 1, если не указан),
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    // чтобы при указании стр совершался пропуск/отступ страниц до отступ offset нужно посчитать,
    // допустим мы перешли на 2 стр и первые 9 девайсов мы пропустим
    let offset = page * limit - limit;

    let devices;
    // реализуем фильтрацию
    if (!brandId && !typeId) {
      devices = await Device.findAll({ limit, offset });
    }
    if (brandId && !typeId) {
      // чтобы посчитать кол-во страниц на фронте, надо вернуть в ответе общее кол-во товаров, для этого есть функция для пагинации findAndCountAll
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
    }
    if (!brandId && typeId) {
      // мы указали доп свойства limit, offset для поиска и сортировки в бд, которые уже присутсвуют
      // в .findAndCountAll({where: {ключевое слово 1, ключевое слово 2}, кол-во данных, с какого кол-ва начинать поиск})
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && typeId) {
      devices = await Device.findAll({ where: { brandId, typeId }, limit, offset });
    }
    return res.json(devices);
  }

  async getOne(req, res) {
    // includes для подгрузки характеристик их объекта, поскольку запрос должен сработать тогда, когда мы откроем страницу детального описания сразу
    // а as - название поля которое будет в этом объекте,
    // т.е этого поля info в самой бд нету, и мы в json объекте отправим его вместе с типовыми данными из модели Device из бд
    // свойство info: [] будет пустым, оно в model при указании зависимости к device указано/создано и тут в include - as
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });
    return res.json(device);
  }

  async delete(req, res) {
    const { id } = req.params;
    const deviceOne = await Device.findOne({
      where: { id },
    });
    const pathImg = `../server/static/${deviceOne.img}`;

    fs.unlink(pathImg, (err) => {
      if (err) throw err;
      console.log(`${pathImg} was deleted`);
    });

    await Device.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ deviceOne });
  }
}

module.exports = new DeviceController();
