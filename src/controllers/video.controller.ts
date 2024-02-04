import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Video from '../models/video.model';
import User from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { customRequest } from './../middlewares/auth.middleware';

export const publishAVideo = asyncHandler(
  async (req: customRequest, res: Response) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description)
      throw new ApiError(400, 'Both title and description are required !');

    //1. check video file
    const localVideoFile = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    const localThumbnailFile = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const videoLocalPath = localVideoFile['videoFile']
      ? localVideoFile['videoFile'][0].path
      : undefined;
    const thumbnailLocalPath = localThumbnailFile['thumbnail']
      ? localThumbnailFile['thumbnail'][0].path
      : undefined;
    // console.log(`from videoController : req.files : `, req.files);

    // 2. upload on cloudinary
    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!uploadVideo && !uploadThumbnail)
      throw new ApiError(400, 'Both video and thumbnail are required !');

    // 3. create video object - create entry in DB
    const video = await Video.create({
      videoFile: uploadVideo.url,
      thumbnail: uploadThumbnail.url,
      title,
      description,
      duration: uploadVideo.duration,
      views: 10,
      isPublished: true,
      owner: req.user._id,
    });

    // 4. check for successful video upload on Db
    if (!video)
      throw new ApiError(500, 'Something went wrong while uploading the video');

    // 5. return the response
    return res
      .status(200)
      .json(new ApiResponse(200, video, 'video uploaded successfully.'));
  }
);

export const getAllVideos = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 10, query, sortBy = -1, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    if (!userId) throw new ApiError(500, 'A user id is mandatory');
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const skip = (pageNumber - 1) * pageSize;

    const videos = await Video.aggregate([
      {
        $match: { owner: Types.ObjectId.createFromHexString(userId as string) },
      },
      {
        $sort: { createdAt: Number(sortBy) as 1 | -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      },
    ]);

    if (!Object.keys(videos).length) throw new ApiError(500, 'Failed to fetch');

    return res
      .status(200)
      .json(new ApiResponse(200, videos, 'all videos fetched successfully'));
  }
);

export const getVideoById = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    //TODO: get video by id

    return res.status(200).json(new ApiResponse(200, {}, 'temporarily done.'));
  }
);

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoId } = req.params;
  //TODO: delete video
});

export const togglePublishStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
  }
);
