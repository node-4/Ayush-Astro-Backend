const mongoose  = require('mongoose');
const { route } = require('../routes/userRoutes');


const callhistorySchema = mongoose.Schema({
    astroId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "astrologer", 
        required: true
    },
    name: {
        type: String
    }, 
    time: {
        type: String
    }, 
    // image: {
    //     type: Strin
    // }
})

const UserCallhistory = mongoose.model('userCallhistory', callhistorySchema)

module.exports = UserCallhistory