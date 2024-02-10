import { Schema, Types, model } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type videoType = {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: {
    prototype: Types.ObjectId;
  };
};

const videoSchema = new Schema<videoType>(
  {
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    owner: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

const Video = model<videoType>('Video', videoSchema);

export default Video;
