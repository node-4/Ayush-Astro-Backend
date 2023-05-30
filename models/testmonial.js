const mongoose = require('mongoose');



const testimonial = mongoose.Schema({
    image: {
        type: String
    },
    Name: {
        type: String
    }, 
    desc: {
        type: String
    }
})

const testiMonial = mongoose.model('testimonal', testimonial);

module.exports = testiMonial