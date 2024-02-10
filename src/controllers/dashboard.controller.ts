import { Request, Response } from 'express';
import { Types } from 'mongoose';
import User, { userType } from '../models/user.model';
import Video from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getChannelStats = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    try {
      const { channelId } = req.params;
      if (!channelId || !Types.ObjectId.isValid(channelId))
        throw new ApiError(500, 'Provide a valid channel ID');

      // 2. check if channel exists
      const channel: userType = await User.findById(channelId);
      if (!channel) throw new ApiError(400, 'No such channel exists.');

      // 3. get channel stats
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
      return res
        .status(200)
        .json(new ApiResponse(200, stats, 'chanel stats fetched'));
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

    try {
      // 1. get channel Id
      const { channelId } = req.params;
      if (!channelId || !Types.ObjectId.isValid(channelId))
        throw new ApiError(500, 'Provide a valid channel ID');

      // 2. check if channel exists
      const channel: userType = await User.findById(channelId);
      if (!channel) throw new ApiError(400, 'No such channel exists.');

      // 3. get all videos of channel
      const videos = await Video.aggregate([
        {
          $match: { owner: Types.ObjectId.createFromHexString(channelId) },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            views: 1,
            thumbnail: 1,
            videoFile: 1,
            createdAt: 1,
          },
        },
      ]);

      // 4. return response
      return res
        .status(200)
        .json(new ApiResponse(200, videos, 'chanel videos fetched'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
