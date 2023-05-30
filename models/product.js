const { model, Schema } = require("mongoose");
const productSchrma = new Schema(
  {
    name: {
      type: String
    },
    link: {
      type: String,
      trim: true,
    },
    price: {
        type: String, 
    }, 
    desc: {
        type: String
    }
  },
  { timestamps: true }
);
module.exports = model("product", productSchrma );
