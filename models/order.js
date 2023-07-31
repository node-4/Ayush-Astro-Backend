const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    astroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "astrologer",
        required: true
    },
    time: {
        type: String,
    },
    // createdAt : new Date().toISOString(),
    name: {
        type: String
    },
    problem: {
        type: String
    },
    language: [],
    rashi: {
        type: String
    },
    astroName: {
        type: String
    }
}, { timestamp: true })

OrderSchema.plugin(mongooseAggregatePaginate);
OrderSchema.plugin(mongoosePaginate);
const order = mongoose.model('order', OrderSchema);
module.exports = order;