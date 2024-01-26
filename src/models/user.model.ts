import { Document, Schema, Types, model } from 'mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type userType = {
  userName: string;
  watchHistory: Types.ObjectId;
  fullName: string;
  email: string;
  avatar: string;
  coverImage: string;
  password: string;
  refreshToken: Record<string, number>;
};

interface userDocument extends userType, Document {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken: Function;
  generateRefreshToken: Function;
}

const userSchema = new Schema<userDocument>(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, required: true, lowercase: true, index: true },
    avatar: { type: String, required: true },
    coverImage: { type: String },
    watchHistory: [{ type: Types.ObjectId, ref: 'Video' }],
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  // encrypting password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = model<userDocument>('User', userSchema);

export default User;
