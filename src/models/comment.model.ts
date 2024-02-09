import { Schema, Types, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type commentType = {
  content: string;
  video?: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
  owner?: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
};

const commentSchema = new Schema<commentType>(
  {
    content: { type: String, required: true },
    video: { type: Types.ObjectId, ref: 'Video' },
    owner: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Comment = model<commentType>('Comment', commentSchema);

export default Comment;
