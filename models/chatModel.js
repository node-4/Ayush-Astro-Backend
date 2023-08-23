const mongoose = require('mongoose');
const schema = mongoose.Schema;
const chatSchema = new schema({
    orderId: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName1: {
        type: String
    },
    astroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "astrologer",
        required: true
    },
    userName2: {
        type: String
    },
    deleteChat1: {
        type: Boolean,
        default: false
    },
    deleteChat2: {
        type: Boolean,
        default: false
    },
    messageDetail: [{
        sender: {
            type: String
        },
        userName: {
            type: String
        },
        Type: {
            type: String,
            enum: ["TEXT", "AUDIO", "VIDEO", "DOCS", "IMAGES"],
            default: "TEXT"
        },
        message: {
            type: String
        },
        video: {
            type: String
        },
        image: {
            type: String
        },
        docs: {
            type: String
        },
        audio: {
            type: String
        },
        time: {
            type: Date,
            default: Date.now(),
        },
        messageClear1: {
            type: Boolean,
            default: false
        },
        messageClear2: {
            type: Boolean,
            default: false
        },
        messageStatus1: {
            type: String,
            enum: ["Read", "Unread"],
            default: "Unread"
        },
        messageStatus2: {
            type: String,
            enum: ["Read", "Unread"],
            default: "Unread"
        },
    }],
    time: {
        type: String,
    },
    chatStatus: {
        type: String,
        enum: ["start", "stop", "pending"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["unconfirmed", "confirmed"],
        default: "unconfirmed",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK", "DELETE"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("chat", chatSchema)