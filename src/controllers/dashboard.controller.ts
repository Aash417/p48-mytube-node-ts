import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Video from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getChannelStats = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    try {
      const { channelId } = req.params;
      const stats = await Video.aggregate([
        {
          $match: {
            owner: new Types.ObjectId(channelId),
          },
        },
        {
          $lookup: {
            from: 'Likes',
            localField: '_id',
            foreignField: 'video',
            as: 'Likes',
          },
        },
        {
          $addFields: {
            likes: {
              $size: { $ifNull: ['$likes', []] },
            },
          },
        },
        {
          $lookup: {
            from: 'subscriber',
            localField: 'owner',
            foreignField: 'channel',
            as: 'subscriber',
          },
        },
        {
          $addFields: {
            subscriber: {
              $size: { $ifNull: ['$subscriber', []] },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalViews: {
              $sum: '$views',
            },
            totalVideos: {
              $sum: 1,
            },

            totalLikes: {
              $sum: '$likes',
            },
          },
        },
        {
          $project: {
            _id: 0,
            owner: 0,
          },
        },
      ]);
      if (!stats) new ApiError(500, 'Failed to fetch channel stats');

      // 4. return response
      return res.status(200).json(new ApiResponse(200, stats, 'done'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const getChannelVideos = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Get all the videos uploaded by the channel
  }
);
