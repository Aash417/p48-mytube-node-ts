import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import Comment, { commentType } from '../models/comment.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { contentType, customRequest } from './../utils/helper';
import { asyncHandler } from '../utils/asyncHandler';
import Video from '../models/video.model';

export const getVideoComments = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
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
  }
);
