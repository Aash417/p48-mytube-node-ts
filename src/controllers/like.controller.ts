import { Response } from 'express';
import { Types } from 'mongoose';
import Comment, { commentType } from '../models/comment.model';
import Like, { likeType } from '../models/like.model';
import Tweet, { tweetType } from '../models/tweet.model';
import Video, { videoType } from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from './../utils/helper';

export const toggleVideoLike = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: toggle like on video
    try {
      // 1. get video id
      const { videoId } = req.params;
      if (!videoId || !Types.ObjectId.isValid(videoId))
        throw new ApiError(500, 'Provide a valid video ID');

      // 2. check if video exists
      const video: videoType = await Video.findById(videoId);
      if (!video) throw new ApiError(400, 'No such video exists.');

      let like: likeType, unlike;

      if (await Like.findOne({ likedBy: req.user._id, video: videoId })) {
        // 3. remove like
        unlike = await Like.deleteOne({
          likedBy: req.user._id,
          video: videoId,
        });
      } else {
        // 4. add like
        like = await Like.create({
          likedBy: req.user._id,
          video: videoId,
        });
        if (!like) throw new ApiError(500, 'Failed to like');
      }

      // 5. return response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            unlike ? unlike : like,
            'Toggled like successfully'
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const toggleCommentLike = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: toggle like on comment
    try {
      // 1. get comment id
      const { commentId } = req.params;
      if (!commentId || !Types.ObjectId.isValid(commentId))
        throw new ApiError(500, 'Provide a valid comment ID');

      // 2. check if comment exists
      const comment: commentType = await Comment.findById(commentId);
      if (!comment) throw new ApiError(400, 'No such comment exists.');

      let like: likeType, unlike;

      if (await Like.findOne({ likedBy: req.user._id, comment: commentId })) {
        // 3. remove like
        unlike = await Like.deleteOne({
          likedBy: req.user._id,
          comment: commentId,
        });
      } else {
        // 4. add like
        like = await Like.create({
          likedBy: req.user._id,
          comment: commentId,
        });
        if (!like) throw new ApiError(500, 'Failed to like');
      }

      // 5. return response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            unlike ? unlike : like,
            'Toggled like successfully'
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const toggleTweetLike = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: toggle like on tweet
    try {
      // 1. get tweet id
      const { tweetId } = req.params;
      if (!tweetId || !Types.ObjectId.isValid(tweetId))
        throw new ApiError(500, 'Provide a valid tweet ID');

      // 2. check if tweet exists
      const tweet: tweetType = await Tweet.findById(tweetId);
      if (!tweet) throw new ApiError(400, 'No such tweet exists.');

      let like: likeType, unlike;

      if (await Like.findOne({ likedBy: req.user._id, tweet: tweetId })) {
        // 3. remove like
        unlike = await Like.deleteOne({
          likedBy: req.user._id,
          tweet: tweetId,
        });
      } else {
        // 4. add like
        like = await Like.create({
          likedBy: req.user._id,
          tweet: tweetId,
        });
        if (!like) throw new ApiError(500, 'Failed to like');
      }

      // 5. return response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            unlike ? unlike : like,
            'Toggled like successfully'
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const getLikedVideos = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: get all liked videos

    try {
      const videos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true },
      });
      if (!videos) throw new ApiError(500, 'Failed to fetch liked videos');
      // 5. return response
      return res
        .status(200)
        .json(new ApiResponse(200, videos, 'Like videos fetched successfully'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
