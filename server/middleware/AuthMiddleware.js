const jwt = require('jsonwebtoken');

// проверка токена на валидность-соответствие, если токен не валиден, возвращаем сообщение о том, что пользователь не авторизован

module.exports = function (req, res, next) {
  // если тип запроса OPTIONS пропускаем этот мидлвар проверку, передавая управление след по цепочке
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    // распарсим из хедера запроса отлепив тип токена Bearaer через пробел от самого токена и по первому индексу получить сам токен
    const token = req.headers.authorization.split(' ')[1]; // Bearer ioj9d8o7t8djui34grtg
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    // если токен есть, нам надо его раскодировать и с помощью .verify проверить токен на валидность
    // первым параметром передать сам токен, а вторым секретный ключ, который мы помещали в окружение .env
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // мы помещаем в поле объекта req свойство user, куда мы помещаем токен вытащенный из decoded, 
    // чтобы он был доступен по этому адресу в другних функциях
    req.user = decoded;
    // вызываем следующую в цепочке функцию промежуточную middleware
    next()
  } catch (error) {
    res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
