const {Sequelize} = require('sequelize');

// Подключение к бд через ORM Sequelize конструктор
module.exports = new Sequelize(
  process.env.DB_NAME, // Название бд
  process.env.DB_USER, // Имя пользователя под которым мы подключаемся, в нашем случае главный пользователь
  process.env.DB_PASSWORD, // Пароль от бд
  {
    dialect: 'postgres', // указываем используемую бд
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);
