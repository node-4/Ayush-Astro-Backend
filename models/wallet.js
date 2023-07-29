const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    UserId: { type: String },
    astrologer: { type: mongoose.Schema.ObjectId, ref: "astrologer" },
    user: { type: mongoose.Schema.ObjectId, ref: "User", },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
