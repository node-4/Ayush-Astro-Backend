const express = require('express');

const order = require('../controllers/orderControllers')



const router = express();

router.post('/', order.CreateOrder);
router.get('/', order.GetAllOrder);
router.get('/:id', order.GetVyID);
router.get('/user/:id', order.GetByOrderUserId);
router.get('/astroId/:id', order.GetByAstroId);
router.put("/:id", order.updateOrder);
router.delete('/:id', order.DeleteOrder);



module.exports = router;
