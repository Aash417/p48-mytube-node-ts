import { Types } from 'mongoose';
import { NextFunction, Response } from 'express';
import Comment, { commentType } from '../models/comment.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

// check if user is the owner of the comment
export const isUserOwner = asyncHandler(
  async (req: customRequest, res: Response, next: NextFunction) => {
    try {
      // 1. get resourceId
      const { commentId } = req.params;
      if (!commentId || !Types.ObjectId.isValid(commentId))
        throw new ApiError(400, 'Provide a valid video ID.');

      // 2. check if resource exits
      const comment: commentType = await Comment.findById(commentId);
      if (!comment) throw new ApiError(404, 'No comment found with this id');

      // 3. check if resource belong to user
      if (comment.owner.toString() !== req.user._id.toString())
        throw new ApiError(
          401,
          'You are not authorized to perform this action.'
        );

      // 4. if authenticated allow access
      return next();
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
