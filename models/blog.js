const mongoose = require("mongoose");
const ourBlogSchema = new mongoose.Schema(
  {
    Date: { type: Date },
    sub_Title: { type: String },
    blog_Images: [{ type: String }],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must belong to a user"],
    },
    intro: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("blog", ourBlogSchema);
