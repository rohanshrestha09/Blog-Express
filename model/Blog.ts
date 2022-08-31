import { Schema, model } from 'mongoose';
import { genre } from '../misc/misc';

const BlogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: [true, 'Author missing'] },
    image: String,
    imageName: String,
    title: {
      type: String,
      required: [true, 'Title missing'],
    },
    content: {
      type: String,
      required: [true, 'Content missing'],
    },
    genre: {
      type: [String],
      required: [true, 'Atleast one genre required'],
      validate: [
        function arrayLimit(val: any) {
          return val.length <= 5;
        },
        'Only 5 genre allowed',
      ],
      enum: {
        values: genre as Array<String>,
        message: '{VALUE} not supported',
      },
    },
    likers: [Schema.Types.ObjectId],
    likes: { type: Number, default: 0 },
    viewers: [Schema.Types.ObjectId],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: Schema.Types.ObjectId, comment: String }],
  },
  { timestamps: true }
);

module.exports = model('Blog', BlogSchema);
