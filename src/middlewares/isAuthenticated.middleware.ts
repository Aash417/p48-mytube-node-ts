import { NextFunction, Response } from 'express';
import { Types } from 'mongoose';
import Playlist from '../models/playlist.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

const isAuthenticated = (model: string) => {
  return asyncHandler(
    async (req: customRequest, res: Response, next: NextFunction) => {
      try {
        // 1. check which model is called
        let Model;
        switch (model) {
          case 'playlist':
            Model = Playlist;
            break;

          default:
            break;
        }
        if (!Model) throw new ApiError(500, 'internal server error');

        // 2. get resourceId
        let resourceId = Object.entries(req.params)[0][1];
        if (!resourceId || !Types.ObjectId.isValid(resourceId))
          throw new ApiError(400, 'Provide a valid ID.');

        // 3. check if resource exits
        const resource = await Model.findById(resourceId);
        if (!resource)
          throw new ApiError(404, 'No resource found with this id');

        // 4. check if resource belong to user
        if (resource.owner.toString() !== req.user._id.toString())
          throw new ApiError(
            401,
            'You are not authorized to perform this action.'
          );

        // 5. if authenticated allow access
        return next();
      } catch (error) {
        res
          .status(500)
          .json(new ApiResponse(error.statusCode, {}, error.message));
        return next(error);
      }
    }
  );
};

export default isAuthenticated;
