import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import User from '../models/user.model';

export interface customRequest extends Request {
  user?: { _id?: string };
}

export const verifyJWT = asyncHandler(
  async (req: customRequest, res: Response, next: NextFunction) => {
    try {
      // 1. get token from user
      const token: string =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      if (!token) throw new ApiError(401, 'unauthorized request.');

      // 2. verify token received from user
      const decodedToken: string | jwt.JwtPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      ) as jwt.JwtPayload;

      // 3. If token is verified find user from DB
      const user = await User.findById(decodedToken?._id).select(
        '-password -refreshToken'
      );
      if (!user) throw new ApiError(401, 'Invalid access token');

      // 4. add a property user to the req and then head to the next middleware
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, error?.message || 'invalid access');
    }
  }
);
