import { Schema, Types, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

type commentType = {
  content: string;
  video: Types.ObjectId;
  owner: Types.ObjectId;
};

const commentSchema = new Schema<commentType>(
  {
    content: { type: String, required: true },
    video: [{ type: Types.ObjectId, ref: 'Video' }],
    owner: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Comment = model<commentType>('Comment', commentSchema);
