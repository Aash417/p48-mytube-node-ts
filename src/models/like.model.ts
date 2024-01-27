import { Schema, Types, model } from 'mongoose';

type likeType = {
  comment: Types.ObjectId;
  video: Types.ObjectId;
  likeBy: Types.ObjectId;
  tweet: Types.ObjectId;
};

const likeSchema = new Schema<likeType>(
  {
    comment: [{ type: Types.ObjectId, ref: 'Comment' }],
    video: [{ type: Types.ObjectId, ref: 'Video' }],
    likeBy: [{ type: Types.ObjectId, ref: 'User' }],
    tweet: [{ type: Types.ObjectId, ref: 'Tweet' }],
  },
  { timestamps: true }
);

export const Like = model<likeType>('Like', likeSchema);
