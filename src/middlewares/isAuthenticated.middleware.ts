import { NextFunction, Response } from 'express';
import { Types, Model as mongooseModel } from 'mongoose';
import Comment, { commentType } from '../models/comment.model';
import Playlist, { playlistType } from '../models/playlist.model';
import Tweet, { tweetType } from '../models/tweet.model';
import Video, { videoType } from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

// check if user is owner of resource or not
const isAuthenticated = (model: string) => {
  return asyncHandler(
    async (req: customRequest, res: Response, next: NextFunction) => {
      try {
        // 1. check which model is called
        let Model: mongooseModel<
          playlistType | commentType | videoType | tweetType
        >;
        switch (model) {
          case 'playlist':
            Model = Playlist;
            break;

          case 'comment':
            Model = Comment;
            break;

          case 'video':
            Model = Video;
            break;

          case 'tweet':
            Model = Tweet;
            break;

          default:
            break;
        }
        if (!Model) throw new ApiError(500, 'internal server error');

        // 2. get resourceId
        let resourceId = Object.entries(req.params)[0][1];
        if (!resourceId || !Types.ObjectId.isValid(resourceId))
          throw new ApiError(400, 'Provide a valid ID.');

        // 3. check if resource exits
        const resource = await Model.findById(resourceId);
        if (!resource)
          throw new ApiError(404, 'No resource found with this id');

        // 4. check if resource belong to user
        if (resource.owner.toString() !== req.user._id.toString())
          throw new ApiError(
            401,
            'You are not authorized to perform this action.'
          );

        // 5. if authenticated allow access
        return next();
      } catch (error) {
        res
          .status(500)
          .json(new ApiResponse(error.statusCode, {}, error.message));
        return next(error);
      }
    }
  );
};

export default isAuthenticated;
