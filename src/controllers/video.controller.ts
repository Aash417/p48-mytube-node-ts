import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Video from '../models/video.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { customRequest } from '../utils/helper';

export const publishAVideo = asyncHandler(
  async (req: customRequest, res: Response) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body;
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
    //TODO: get all videos based on query, sort, pagination
    const { page = 1, limit = 10, query, sortBy = -1, userId } = req.query;
    // 1. check for user id
    if (!userId) throw new ApiError(500, 'A user id is mandatory');
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    // 2. list all videos of user
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

    // 3. return response
    return res
      .status(200)
      .json(new ApiResponse(200, videos, 'data fetched successfully'));
  }
);

export const getVideoById = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get video by id
    const { videoId } = req.params;
    if (!videoId) throw new ApiError(500, 'Provide a video Id.');

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(500, 'No video found with the ID');

    return res
      .status(200)
      .json(new ApiResponse(200, video, 'data fetched successfully'));
  }
);

export const updateVideo = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: update video details like title, description, thumbnail

    // 1. take video id from params
    const { videoId } = req.params;

    // 2. take new values from the user
    const { title, description } = req.body;

    // 3. check if at least one field is provided
    if (!title && !description && !req.file)
      throw new ApiError(500, 'Provide at least one field to update');

    // 4. update with new values
    type fieldType = {
      title?: string;
      description?: string;
      thumbnail?: string;
    };
    const updateFields: fieldType = {}; // object to store fields to update

    if (title) {
      updateFields.title = title;
    }
    if (description) {
      updateFields.description = description;
    }
    if (req.file) {
      const thumbnailLocalPath = req.file.path;
      updateFields.thumbnail = (
        await uploadOnCloudinary(thumbnailLocalPath)
      ).url;
    }

    const updated = await Video.findByIdAndUpdate(videoId, updateFields, {
      new: true,
      useFindAndModify: false,
    });
    if (!updated)
      throw new ApiError(500, 'Something went wrong while updating');

    // 5. return response
    return res
      .status(200)
      .json(new ApiResponse(200, updated, 'Data updated successfully'));
  }
);

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  //TODO: delete video
  const { videoId } = req.params;
  await Video.findByIdAndDelete(videoId);

  res.status(200).json(new ApiResponse(200, {}, 'deleted successfully'));
});

export const togglePublishStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
  }
);
