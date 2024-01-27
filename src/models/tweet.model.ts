import { Schema, Types, model } from 'mongoose';

type tweetType = {
  owner: Types.ObjectId;
  content: string;
};

const tweetSchema = new Schema<tweetType>(
  {
    owner: [{ type: Types.ObjectId, ref: 'User' }],
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Tweet = model<tweetType>('Tweet', tweetSchema);