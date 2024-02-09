import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Like, likeType } from '../models/like.model';
import Video, { videoType } from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from './../utils/helper';
import Comment, { commentType } from '../models/comment.model';

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
      // 1. get video id
      const { commentId } = req.params;
      if (!commentId || !Types.ObjectId.isValid(commentId))
        throw new ApiError(500, 'Provide a valid video ID');

      // 2. check if video exists
      const comment: commentType = await Comment.findById(commentId);
      if (!comment) throw new ApiError(400, 'No such video exists.');

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
  async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
  }
);

export const getLikedVideos = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get all liked videos
  }
);
