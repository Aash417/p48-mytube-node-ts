import { Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
// import { User } from '../models/user.model.js';
import { Subscription } from '../models/subscription.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const toggleSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
  }
);

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    const { channelId } = req.params;
  }
);

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(
  async (req: Request, res: Response) => {
    const { subscriberId } = req.params;
  }
);
