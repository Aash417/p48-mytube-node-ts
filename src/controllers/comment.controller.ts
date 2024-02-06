import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Comment, { commentType } from '../models/comment.model';
import Video from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { contentType, customRequest } from './../utils/helper';

export const getVideoComments = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get all comments for a video
    try {
      const { videoId } = req.params;
      const { page = 1, limit = 10, sortBy = -1 } = req.query;
      const pageNumber = Number(page);
      const pageSize = Number(limit);
      const skip = (pageNumber - 1) * pageSize;

      // 1. check for videoId
      if (!videoId || !Types.ObjectId.isValid(videoId))
        throw new ApiError(500, 'Provide a valid video ID');

      // 2. check if video exists
      const video = await Video.findById(videoId);
      if (!video) throw new ApiError(400, 'No such video exists.');

      // 3. fetch all comments of video
      const comments: commentType[] = await Comment.aggregate([
        {
          $match: {
            video: Types.ObjectId.createFromHexString(videoId),
          },
        },
        {
          $sort: { createdAt: Number(sortBy) as 1 | -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: pageSize,
        },
      ]);
      if (!comments) throw new ApiError(500, 'Failed to fetch comments.');

      // 4. return response
      return res
        .status(200)
        .json(new ApiResponse(200, comments, 'comments fetched successfully'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const addComment = asyncHandler(
  async (req: customRequest, res: Response) => {
    // TODO: add a comment to a video
    try {
      // 1. get videoId
      const { videoId } = req.params;
      if (!videoId || !Types.ObjectId.isValid(videoId))
        throw new ApiError(400, 'Provide a valid video ID.');

      // 2. check if video with id exists
      const video = await Video.findById(videoId);
      if (!video) throw new ApiError(400, 'No such video exists.');

      // 3. get comment to post
      const { content }: contentType = req.body;
      if (!content)
        throw new ApiError(400, 'Some content is required to comment.');

      // 4. post comment on video
      const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
      });
      if (!comment)
        throw new ApiError(
          500,
          'Something went wrong while posting your comment'
        );

      //5. return response
      res
        .status(200)
        .json(new ApiResponse(200, comment, 'Commented successfully.'));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, {}, error.message));
    }
  }
);

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: update a comment
    try {
      // 1. get comment id
      const { commentId } = req.params;
      if (!commentId || !Types.ObjectId.isValid(commentId))
        throw new ApiError(400, 'Provide a valid video ID.');

      // 2. check if comment exists
      const comment: commentType = await Comment.findById(commentId);
      if (!comment) throw new ApiError(400, 'No such video exists.');

      // 3. get content to be updated
      const { content }: contentType = req.body;
      if (!content)
        throw new ApiError(400, 'Some content is required to update.');

      // 4. update content
      const updatedComment: commentType = await Comment.findByIdAndUpdate(
        commentId,
        {
          content,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (!updatedComment)
        throw new ApiError(
          500,
          'Something went wrong while updating your comment'
        );

      // 5. return response
      res
        .status(200)
        .json(new ApiResponse(200, updatedComment, 'updated successfully'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: delete a comment
    try {
      // 1. get comment id
      const { commentId } = req.params;
      if (!commentId || !Types.ObjectId.isValid(commentId))
        throw new ApiError(400, 'Provide a valid comment ID.');

      // 2. check if comment exists
      const comment: commentType = await Comment.findByIdAndDelete(commentId);
      if (!comment) throw new ApiError(400, 'No such comment exists.');

      // 3. return response
      res.status(200).json(new ApiResponse(200, {}, 'deleted successfully'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
