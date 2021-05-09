require('dotenv').config(); // Чтобы мы могли считывать переменные окружения из env
const express = require('express');
const sequelize = require('./db');
const router = require('./routes/index');
const models = require('./model/models.js');
const cors = require('cors'); // чтобы мы могли отправлять запросы из браузера
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
// Внимание!!! очередность регистрации имеет большое значение
// Если fileUpload зарегистрировать позже, чем роутер, то невозможна будет отправка файлов и form-data
app.use('/api', router);
// Этот модуль middleware с обработкой ошибки, должен регистрироваться в express в самом конце, он является замыкающим
// Поскольку на нем работа прекращается и после него мы возвращаем на клиент ответ
app.use(errorHandler);

// Функция для подключения к бд

const start = async () => {
  try {
    // Само подключение к бд
    await sequelize.authenticate();
    // Этот метод сверяет состояние бд со схемой бд описанной (в модели)
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
