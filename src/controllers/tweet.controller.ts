import { Types, isValidObjectId } from 'mongoose';
import { Request, Response } from 'express';
import Tweet, { tweetType } from '../models/tweet.model';
import User from '../models/user.model';
import { customRequest } from './../middlewares/auth.middleware';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const createTweet = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: create tweet
    // 1. get content from user
    interface contentType {
      content: string;
    }
    const { content }: contentType = req.body;
    if (!content) throw new ApiError(400, 'some content is required to tweet.');

    try {
      // 2. put tweet in db
      const tweet = await Tweet.create({
        owner: req.user._id,
        content,
      });
      if (!tweet)
        throw new ApiError(500, 'Something went wrong while posting tweet.');

      // 3. retrun res
      res
        .status(200)
        .json(new ApiResponse(200, tweet, 'tweet successfully created'));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, {}, error.message));
    }
  }
);

export const getUserTweets = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: get user tweets
    // 1. get user id from params
    const { userId } = req.params;
    if (!userId && !isValidObjectId(userId))
      throw new ApiError(400, 'Provide a valid user ID');

    try {
      // 2. check if user exists in db
      const user = await User.findById(
        Types.ObjectId.createFromHexString(userId)
      );
      if (!user) throw new ApiError(400, 'No user found with this Id.');

      // 3. if exits fetch all his tweets
      const tweets: tweetType[] = await Tweet.aggregate([
        {
          $match: {
            owner: Types.ObjectId.createFromHexString(userId),
          },
        },
      ]);
      if (!tweets)
        throw new ApiError(
          500,
          'Something went wrong while fetching user tweets.'
        );

      // 4. if no error till now return res
      res
        .status(200)
        .json(new ApiResponse(200, tweets, 'All tweets fetched successfully.'));
    } catch (error) {
      console.log(error);
      res.status(500).json(new ApiResponse(500, {}, error.message));
    }
  }
);

export const updateTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: update tweet
});

export const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: delete tweet
  // 1. get id from params
  const { tweetId } = req.params;
  if (!tweetId && !isValidObjectId(tweetId))
    throw new ApiError(400, 'Provide a valid tweet ID');

  // 2. delete tweet
  try {
    await Tweet.findByIdAndDelete(tweetId);
    res
      .status(200)
      .json(new ApiResponse(200, {}, 'tweet deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
});
