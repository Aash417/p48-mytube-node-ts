import { Types } from 'mongoose';
import { NextFunction, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from './auth.middleware';
import Tweet from '../models/tweet.model';
import { ApiResponse } from '../utils/ApiResponse';

// check if user is the owner of the tweet
export const isUserOwner = asyncHandler(
  async (req: customRequest, res: Response, next: NextFunction) => {
    const { tweetId } = req.params;

    try {
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) throw new ApiError(400, 'No tweet found with this id');

      if (tweet.owner.toString() === req.user._id.toString()) return next();

      throw new ApiError(500, 'You are not authorized to perform this action.');
    } catch (error) {
      res.status(500).json(new ApiResponse(500, {}, error.message));
    }
  }
);
