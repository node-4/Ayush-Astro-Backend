const express = require("express");
const horoScopeControllers = require('../controllers/horoScopeControllers');




const router = express();


router.post('/', horoScopeControllers.AddHoroScope);
router.get('/', horoScopeControllers.GetAllHoroScope);
router.get('/:id', horoScopeControllers.getHoroByID);
router.put('/:id', horoScopeControllers.updateHoroScope);
router.delete('/:id', horoScopeControllers.deleteHoroScope);






module.exports = router ; 