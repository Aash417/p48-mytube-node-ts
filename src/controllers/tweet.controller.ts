import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Tweet } from '../models/tweet.model.js';
// import {User} from "../models/user.model.js"
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: create tweet
});

export const getUserTweets = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: get user tweets
  }
);

export const updateTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: update tweet
});

export const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: delete tweet
});
