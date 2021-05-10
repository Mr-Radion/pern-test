const bcrypt = require('bcrypt'); // для шифрования(говорят еще захешировать) пароля перед сохранением в бд, не имеет отношение к токену
const jwt = require('jsonwebtoken'); // для кодирования данных пользователя в токен
const ApiError = require('../error/ApiError');
const { User, Basket } = require('../model/models.js');

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      // здесь должна быть по хорошему валидация
      return next(ApiError.badRequest('Некорректный email или пароль'));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'));
    }
    // если пользователя такого нету и ввели корректный email с паролем, мы можем захешировать пароль
    // первым параметром передаем сам пароль, а вторым передаем сколько раз мы будем его хэшировать, слишком большое число не указываем
    const hashPassword = await bcrypt.hash(password, 5);
    // создаем пользователя
    const user = await User.create({ email, role, password: hashPassword });
    // сразу для пользователя создаем корзину
    const basket = await Basket.create({ userId: user.id });
    // генерируем токен, который будем передавать на фронт и сохранять на бэке для верификации и проверки при каждом запроче через хидер
    // передаем первым параметром в центр payload jwt токена данные
    // во второй параметр мы передаем секретный ключ, который мы задаем рандомно и должны видеть только мы, поэтому сохраняем в переменной окружения .env
    // 3 параметром функция принимает опции, например опция expiresIn которая отвечает за время существования токена (выход на фронте автоматический при входе, если не совпадает и редирект на страницу входа)
    const token = generateJwt(user.id, user.email, user.role);
    // отправляем токен после регистрации в ответе
    return res.json({ token });
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('Пользователь не найден'));
    }
    // проверка совпадения полученного пароля с паролем из бд
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль'));
    }
    // если все верно, мы генерируем новый токен и возвращаем при каждой новой авторизации
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async check(req, res, next) {
    // весь смысл данной функции в том, чтобы сгенерировать новый токен и отправить его обратно на клиент
    // сама проверка токена совершена в middleware ранее
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}

module.exports = new UserController();
