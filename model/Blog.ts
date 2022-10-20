import { Schema, model } from 'mongoose';
import { genre } from '../misc';

const BlogSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Author missing'] },
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
          return val.length <= 4;
        },
        'Only 4 genre allowed',
      ],
      enum: {
        values: genre as Array<String>,
        message: '{VALUE} not supported',
      },
    },
    likers: { type: [Schema.Types.ObjectId], default: [] },
    likesCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: { type: [{ commenter: Schema.Types.ObjectId, comment: String }], default: [] },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model('Blog', BlogSchema);
