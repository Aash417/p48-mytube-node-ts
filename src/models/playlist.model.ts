import { Schema, Types, model } from 'mongoose';

export interface playlistType {
  name: string;
  description?: string;
  videos?: Types.ObjectId;
  owner: Types.ObjectId;
}

const playlistSchema = new Schema<playlistType>(
  {
    name: { type: String, required: true },
    description: { type: String },
    videos: [{ type: Types.ObjectId, ref: 'Video' }],
    owner: [{ type: Types.ObjectId, ref: 'User', required: true }],
  },
  { timestamps: true }
);

const Playlist = model<playlistType>('Playlist', playlistSchema);

export default Playlist;
