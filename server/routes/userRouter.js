const Router = require('express');
const router = new Router();

router.post('/registration'); // регистрация
router.post('/login'); // авторизация
router.get('/auth'); // проверка авторизован пользователь или нет по jwt токену

module.exports = router;
