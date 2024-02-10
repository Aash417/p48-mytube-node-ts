import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

export const getChannelStats = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  }
);

export const getChannelVideos = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: Get all the videos uploaded by the channel
  }
);
