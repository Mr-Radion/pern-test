const jwt = require('jsonwebtoken');

// проверка ролей, в нашем случае для админа только доступна функция добавления типов девайсов, нам нужно убедится он ли совершил запрос
// мы вызываем функцию, передаем туда роль и эта функция замыканием возвращает нам другую функцию middleware
// в логике единственное отличие от логики проверки токена, что нам нужно будет выцепить роль пользователя и сравнить ее с той,
// которую мы передали в middleware
// можно улучшить код, создав общую логику на двоих повторяющуюся с проверкой токена
module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1]; // Bearer ioj9d8o7t8djui34grtg
      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }
      // в decoded возвращаются все данные usera из бд (мыло, пароль, роль, id и т.п)
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({
          message: 'Нет доступа',
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Пользователь не авторизован' });
    }
  };
};
