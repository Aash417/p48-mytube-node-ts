import { NextFunction } from 'express';
import Video from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

// check if user is the owner of the video
export const isUserOwner = asyncHandler(
  async (req: customRequest, res: Response, next: NextFunction) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (video.owner.toString() === req.user._id.toString()) return next();

    throw new ApiError(500, 'You are not authorized to perform this action.');
  }
);
