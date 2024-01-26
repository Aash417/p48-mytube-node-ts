import { Schema, Types, model } from 'mongoose';

type subscriptionType = {
  subscriber: Types.ObjectId;
  channel: Types.ObjectId;
};

const subscriptionSchema = new Schema<subscriptionType>(
  {
    subscriber: [{ type: Types.ObjectId, ref: 'User' }],
    channel: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Subscription = model<subscriptionType>(
  'Subscription',
  subscriptionSchema
);
