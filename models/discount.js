const mongoose = require('mongoose');


const discountSchema = mongoose.Schema({
    code: {
        type: String
    }, 
    activeDate : {
        type: String
    }, 
    expireDate : {
        type: String
    }, 
    percent :{
        type: Number
    }
})

const discount = mongoose.model('discount', discountSchema)
module.exports  = discount