import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Subscription, { subscriptionType } from '../models/subscription.model';
import User, { userType } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

export const toggleSubscription = asyncHandler(
  async (req: customRequest, res: Response) => {
    // TODO: toggle subscription
    try {
      // 1. get channelId from user
      const { channelId } = req.params;
      if (!channelId || !Types.ObjectId.isValid(channelId))
        throw new ApiError(500, 'Provide a valid channel ID');

      // 2. check if channel exists
      const channel: userType = await User.findById(channelId);
      if (!channel) throw new ApiError(400, 'No such channel exists.');

      let subscribe: subscriptionType, unsubscribe;
      if (
        await Subscription.findOne({
          subscriber: req.user._id,
          channel: channelId,
        })
      ) {
        // 3. remove subscribe
        unsubscribe = await Subscription.deleteOne({
          subscriber: req.user._id,
          channel: channelId,
        });
        if (!unsubscribe) throw new ApiError(500, 'Failed to unsubscribe');
      } else {
        // 4. add subscribe
        subscribe = await Subscription.create({
          subscriber: req.user._id,
          channel: channelId,
        });
        if (!subscribe) throw new ApiError(500, 'Failed to subscribe');
      }

      // 5. return response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            unsubscribe ? unsubscribe : subscribe,
            unsubscribe ? 'channel unsubscribed' : 'channel subscribed'
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

// controller to return subscriber list of a channel
export const getUserChannelSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // 1. get channelId from user
      const { channelId } = req.params;
      if (!channelId || !Types.ObjectId.isValid(channelId))
        throw new ApiError(500, 'Provide a valid channel ID');

      // 2. check if channel exists
      const channel: userType = await User.findById(channelId);
      if (!channel) throw new ApiError(400, 'No such channel exists.');

      // 3. find all docs having channelId = total subscriber
      const subscriber = await Subscription.aggregate([
        {
          $match: { channel: Types.ObjectId.createFromHexString(channelId) },
        },
        {
          $project: {
            subscriber: 1,
          },
        },
      ]);
      if (!subscriber)
        throw new ApiError(500, 'Failed to fetch subscriber list');

      // 4. return response
      return res.status(200).json(new ApiResponse(200, subscriber, 'done'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

// controller to return channel list to which user has subscribed
export const getSubscribedChannels = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // 1. get channelId from user
      const { subscriberId } = req.params;
      if (!subscriberId || !Types.ObjectId.isValid(subscriberId))
        throw new ApiError(500, 'Provide a valid channel ID');

      // 2. check if subscriber exists
      const subscriber: userType = await User.findById(subscriberId);
      if (!subscriber) throw new ApiError(400, 'No such subscriber exists.');

      // 3. find all docs having subscriberId = total subscriber
      const channel = await Subscription.aggregate([
        {
          $match: {
            subscriber: Types.ObjectId.createFromHexString(subscriberId),
          },
        },
        {
          $project: {
            channel: 1,
          },
        },
      ]);
      if (!channel) throw new ApiError(500, 'Failed to fetch subscriber list');

      // 4. return response
      return res.status(200).json(new ApiResponse(200, channel, 'done'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
