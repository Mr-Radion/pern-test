const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController.js');
const checkRole = require('../middleware/CheckRoleMiddleware');

router.post('/', checkRole('ADMIN'), deviceController.create);
router.get('/', deviceController.getAll);
router.get('/:id', deviceController.getOne);
router.delete('/:id', checkRole('ADMIN'), deviceController.delete);

module.exports = router;
