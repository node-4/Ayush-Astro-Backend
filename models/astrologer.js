const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const AstrologerSchema = new mongoose.Schema({
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
    required: false
  },
  email: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  gender: {
    type: String,
  },
  image: {
    type: String,
  },
  state: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  },
  pincode: {
    type: String,
  },
  otp: {
    type: String
  },
  language: [],
  desc: {
    type: String
  },
  rashi: {
    type: String
  },
  skills: [],
  specification: [],
  rating: [{
    type: String
  }],
  fees: [{
    type: String,
  }],
  aboutMe: {
    type: String
  },
  dailyhoures: {
    type: String,
    required: false
  },
  experience: {
    type: String,
    require: false
  },
  callStatus: {
    type: String,
    enum: ["Engaged", "Not Engaged"]
  },
}, { timestamps: true });
AstrologerSchema.plugin(mongoosePaginate);
AstrologerSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("astrologer", AstrologerSchema);
