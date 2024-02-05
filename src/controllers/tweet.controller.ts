import { Types, isValidObjectId } from 'mongoose';
import { Request, Response } from 'express';
import Tweet, { tweetType } from '../models/tweet.model';
import User from '../models/user.model';
import { customRequest } from './../middlewares/auth.middleware';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

interface contentType {
  content: string;
}

export const createTweet = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: create tweet
    try {
      // 1. get content from user
      const { content }: contentType = req.body;
      if (!content)
        throw new ApiError(400, 'some content is required to tweet.');

      // 2. put tweet in db
      const tweet = await Tweet.create({
        owner: req.user._id,
        content,
      });
      if (!tweet)
        throw new ApiError(500, 'Something went wrong while posting tweet.');

      // 3. return res
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

    try {
      // 1. get user id from params
      const { userId } = req.params;
      if (!userId || !Types.ObjectId.isValid(userId))
        throw new ApiError(400, 'Provide a valid user ID');

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

export const getTweet = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { tweetId } = req.params;
    if (!tweetId || !Types.ObjectId.isValid(tweetId))
      throw new ApiError(400, 'Provide a valid tweet ID');

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new ApiError(400, 'No tweet found with this id');

    res.status(200).json(new ApiResponse(200, tweet, 'Tweet fetched.'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
});

export const updateTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: update tweet
  try {
    // 1. get id from params
    const { tweetId } = req.params;
    if (!tweetId || !Types.ObjectId.isValid(tweetId))
      throw new ApiError(400, 'Provide a valid tweet ID');

    // 2. get content from body
    const { content }: contentType = req.body;
    if (!content) throw new ApiError(400, 'some content is required to tweet.');

    // 3. update tweet
    const tweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    if (!tweet)
      throw new ApiError(500, 'Something went wrong while updating tweet.');

    // 4. return response
    res
      .status(200)
      .json(new ApiResponse(200, tweet, 'tweet updated successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
});

export const deleteTweet = asyncHandler(async (req: Request, res: Response) => {
  //TODO: delete tweet
  try {
    // 1. get id from params
    const { tweetId } = req.params;
    if (!tweetId || !Types.ObjectId.isValid(tweetId))
      throw new ApiError(400, 'Provide a valid tweet ID');

    // 2. delete tweet
    await Tweet.findByIdAndDelete(tweetId);
    res
      .status(200)
      .json(new ApiResponse(200, {}, 'tweet deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, {}, error.message));
  }
});
