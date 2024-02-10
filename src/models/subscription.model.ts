import { Schema, Types, model } from 'mongoose';

export interface subscriptionType {
  subscriber: {
    prototype: Types.ObjectId;
  };
  channel: {
    prototype: Types.ObjectId;
  };
}

const subscriptionSchema = new Schema<subscriptionType>(
  {
    subscriber: { type: Types.ObjectId, ref: 'User', required: true },
    channel: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Subscription = model<subscriptionType>(
  'Subscription',
  subscriptionSchema
);

export default Subscription;
