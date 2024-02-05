import { Schema, Types, model } from 'mongoose';

export interface tweetType {
  owner: Types.ObjectId;
  content: string;
}

const tweetSchema = new Schema<tweetType>(
  {
    owner: [{ type: Types.ObjectId, ref: 'User' }],
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Tweet = model<tweetType>('Tweet', tweetSchema);

export default Tweet;
