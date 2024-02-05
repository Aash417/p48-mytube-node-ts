import { Request, Response } from 'express';
import Tweet from '../models/tweet.model';
import { customRequest } from './../middlewares/auth.middleware';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const createTweet = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: create tweet
    interface contentType {
      content: string;
    }
    const { content }: contentType = req.body;
    if (!content) throw new ApiError(400, 'some content is required to tweet.');

    try {
      const tweet = await Tweet.create({
        owner: req.user._id,
        content,
      });
      if (!tweet)
        throw new ApiError(500, 'Something went wrong while posting tweet.');

      res
        .status(200)
        .json(new ApiResponse(200, tweet, 'tweet successfully created'));
    } catch (error) {
      res
        .status(500)
        .json(new ApiResponse(500, null, 'Failed to create tweet'));
    }
  }
);

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
