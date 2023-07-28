const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
        appLink: { type: String },
        message: { type: String },
}, {
        timestamps: true
})

module.exports = mongoose.model('appDetail', reviewSchema);
