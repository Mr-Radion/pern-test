const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleWare = require('../middleware/AuthMiddleware');

router.post('/registration', userController.registration); // регистрация
router.post('/login', userController.login); // авторизация
router.get('/auth', authMiddleWare, userController.check); // проверка авторизован пользователь или нет по jwt токену

module.exports = router;
