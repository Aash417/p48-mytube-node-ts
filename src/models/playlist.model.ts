import { Schema, Types, model } from 'mongoose';

type playlistType = {
  name: string;
  description: string;
  videos: Types.ObjectId;
  owner: Types.ObjectId;
};

const playlistSchema = new Schema<playlistType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    videos: [{ type: Types.ObjectId, ref: 'Video' }],
    owner: [{ type: Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Playlist = model<playlistType>('Playlist', playlistSchema);
