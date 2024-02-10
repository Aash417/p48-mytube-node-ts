import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const healthcheck = asyncHandler(
  async (_req: Request, res: Response) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { status: 'ok' },
          'everything is working correctly.'
        )
      );
  }
);
