import { Schema, Types, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type commentType = {
  content: string;
  video: {
    prototype: Types.ObjectId;
  };
  owner: {
    prototype: Types.ObjectId;
  };
};

const commentSchema = new Schema<commentType>(
  {
    content: { type: String, required: true },
    video: { type: Types.ObjectId, ref: 'Video', required: true },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Comment = model<commentType>('Comment', commentSchema);

export default Comment;
