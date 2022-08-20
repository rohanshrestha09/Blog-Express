import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
  {
    author: Schema.Types.ObjectId,
    image: {
      type: String,
      required: [true, "Please chose an image"],
    },
    title: {
      type: String,
      required: [true, "Please input title"],
    },
    content: {
      type: String,
      required: [true, "Please input content"],
    },
    likers: [Schema.Types.ObjectId],
    likes: Number,
    views: Number,
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: Schema.Types.ObjectId, content: String }],
  },
  { timestamps: true }
);

module.exports = model("Blog", BlogSchema);
