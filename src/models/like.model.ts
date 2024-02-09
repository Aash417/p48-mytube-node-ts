import { Schema, Types, model } from 'mongoose';

export interface likeType {
  comment?: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
  video?: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
  likedBy: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
  tweet?: {
    prototype?: Types.ObjectId;
    cacheHexString?: unknown;
    generate?: {};
    createFromTime?: {};
    createFromHexString?: {};
    createFromBase64?: {};
    isValid?: {};
  };
}

const likeSchema = new Schema<likeType>(
  {
    comment: { type: Types.ObjectId, ref: 'Comment' },
    video: { type: Types.ObjectId, ref: 'Video' },
    likedBy: { type: Types.ObjectId, ref: 'User' },
    tweet: { type: Types.ObjectId, ref: 'Tweet' },
  },
  { timestamps: true }
);

export const Like = model<likeType>('Like', likeSchema);
