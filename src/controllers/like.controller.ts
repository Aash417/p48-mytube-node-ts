import { Response } from 'express';
import { Types, Model as mongooseModel } from 'mongoose';
import Comment, { commentType } from '../models/comment.model';
import Like from '../models/like.model';
import Tweet, { tweetType } from '../models/tweet.model';
import Video, { videoType } from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from './../utils/helper';

export const toggleLike = (model: string) => {
  return asyncHandler(async (req: customRequest, res: Response) => {
    try {
      // 1. check which model is called
      let Model: mongooseModel<commentType | videoType | tweetType>;
      switch (model) {
        case 'video':
          Model = Video;
          break;

        case 'tweet':
          Model = Tweet;
          break;

        case 'comment':
          Model = Comment;
          break;

        default:
          break;
      }
      if (!Model) throw new ApiError(500, 'Failed to assign Model');

      // 2. get resource id
      let resourceId = Object.entries(req.params)[0][1];
      if (!resourceId || !Types.ObjectId.isValid(resourceId))
        throw new ApiError(500, `Provide a valid ${model} ID`);

      // 3. check if resource exists
      const resource = await Model.findById(resourceId);
      if (!resource) throw new ApiError(400, `No such ${resource} exists.`);

      // toggle like
      let like, unlike;
      const searchObj = {
        likedBy: req.user._id,
        [model]: resourceId,
      };

      const checkLikeStatus = await Like.find(searchObj);
      if (checkLikeStatus.length === 0) {
        // 3. add like
        like = await Like.create(searchObj);
        if (!like) throw new ApiError(500, 'Failed to like');
      } else {
        // 4. remove like
        unlike = await Like.deleteOne(searchObj);
        if (!unlike) throw new ApiError(500, 'Failed to unlike');
      }

      // 5. return response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            unlike ? unlike : like,
            unlike ? `${model} unliked` : `${model} liked`
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  });
};

export const getLikedVideos = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: get all liked videos

    try {
      const videos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true },
      });
      if (!videos) throw new ApiError(500, 'Failed to fetch liked videos');
      // . return response
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
