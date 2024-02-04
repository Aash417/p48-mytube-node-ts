import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Like } from '../models/like.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const toggleVideoLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
  }
);

export const toggleCommentLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
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
