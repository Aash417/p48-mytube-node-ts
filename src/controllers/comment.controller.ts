import { Request, Response } from 'express';
import { Comment } from '../models/comment.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getVideoComments = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
  }
);

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  // TODO: add a comment to a video
});

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: update a comment
  }
);

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: delete a comment
  }
);