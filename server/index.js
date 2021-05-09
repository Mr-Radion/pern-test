require('dotenv').config(); // Чтобы мы могли считывать переменные окружения из env
const express = require('express');
const sequelize = require('./db');
const router = require('../routes/index.js');
const models = require('./model/models.js');
const cors = require('cors'); // чтобы мы могли отправлять запросы из браузера

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json())
app.use('/api', router)

// Функция для подключения к бд

const start = async () => {
  try {
    // Само подключение к бд
    await sequelize.authenticate()
    // Этот метод сверяет состояние бд со схемой бд описанной (в модели)
    await sequelize.sync()
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (e) {
    console.log(e)
  }
}

start()
