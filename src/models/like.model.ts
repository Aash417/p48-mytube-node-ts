import { Schema, Types, model } from 'mongoose';

export interface likeType {
  comment?: {
    prototype?: Types.ObjectId;
  };
  video?: {
    prototype?: Types.ObjectId;
  };
  likedBy: {
    prototype: Types.ObjectId;
  };
  tweet?: {
    prototype?: Types.ObjectId;
  };
}

const likeSchema = new Schema<likeType>(
  {
    comment: { type: Types.ObjectId, ref: 'Comment' },
    video: { type: Types.ObjectId, ref: 'Video' },
    likedBy: { type: Types.ObjectId, ref: 'User', required: true },
    tweet: { type: Types.ObjectId, ref: 'Tweet' },
  },
  { timestamps: true }
);

const Like = model<likeType>('Like', likeSchema);

export default Like;
