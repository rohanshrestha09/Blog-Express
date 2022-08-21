import { Schema, model } from "mongoose";

const BlogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: [true, "Author missing"] },
    image: String,
    imageName: String,
    title: {
      type: String,
      required: [true, "Title missing"],
    },
    content: {
      type: String,
      required: [true, "Content missing"],
      minLength: [20, "Content must contain atleast 20 characters"],
    },
    likers: [Schema.Types.ObjectId],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: Schema.Types.ObjectId, content: String }],
  },
  { timestamps: true }
);

module.exports = model("Blog", BlogSchema);
