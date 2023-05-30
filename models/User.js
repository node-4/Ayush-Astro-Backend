const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        created: {
            type: String,
            default: new Date().toISOString(),
        },
        password: {
            type: String,
            required: false,
        },
        confirmpassword: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        mobile: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        state: {
            type: String,
            required: false,
        },
        district: {
            type: String,
            required: false,
        },
        pincode: {
            type: String,
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
        },
        accountVerification: {
            type: Boolean,
            default: false,
        },
        language: [],
        desc: {
            type: String,
        },
        rashi: {
            type: String,
        },
        skills: [],

        ReferCode: { type: String, unique: false },
        referStatus: {
            type: String,
            default: "unused",
            enum: ["used", "unused"],
        },

        ActiveNotification: { type: Boolean, default: false },

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Follow",
            },
        ],

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Follow",
            },
        ],
    },

    { timestamps: false }
);

function generateOTP() {
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

userSchema.pre("save", function (next) {
    const refer = generateOTP() + this.first_Name;
    this.ReferCode = refer;
    console.log("generated referal Code!");
    next();
});

module.exports = mongoose.model("User", userSchema);
