import { NextFunction, Request, Response } from 'express';

// with try catch
/*
export const asyncHandler =
  (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.status(err.code).json({
        success: false,
        message: err.message,
      });
    }
  };
*/

// with promises

export const asyncHandler =
  (requestHandler: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log(`Error in async handler ${err}`);
      next(err);
    });
  };
