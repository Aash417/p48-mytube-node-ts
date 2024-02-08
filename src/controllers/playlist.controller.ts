import { Request, Response, response } from 'express';
import Playlist, { playlistType } from '../models/playlist.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';
import { Types } from 'mongoose';

export const createPlaylist = asyncHandler(
  async (req: customRequest, res: Response) => {
    //TODO: create playlist
    try {
      // 1. get name & description
      const { name, description = '' }: playlistType = req.body;
      if (!name) throw new ApiError(400, 'A playlist name is required.');

      // 2. create playlist
      const playlist: playlistType = await Playlist.create({
        name,
        description,
        owner: req.user._id,
      });
      if (!playlist) throw new ApiError(500, 'Failed to create playlist.');

      // 3. return response
      res.status(200).json(new ApiResponse(200, playlist, 'Playlist created.'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const getUserPlaylists = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get user playlists

    try {
      // 1. get user id
      const { userId } = req.params;
      if (!userId || !Types.ObjectId.isValid(userId))
        throw new ApiError(400, 'Provide a valid user ID');

      // 2. get playlists
      const playlists: playlistType[] = await Playlist.aggregate([
        {
          $match: { owner: Types.ObjectId.createFromHexString(userId) },
        },
      ]);
      if (!playlists) throw new ApiError(500, 'Failed to fetch playlist.');

      // 3. return response
      res.status(200).json(new ApiResponse(200, playlists, 'created.'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const getPlaylistById = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: get playlist by id
    try {
      // 1. get id
      const { playlistId } = req.params;
      if (!playlistId || !Types.ObjectId.isValid(playlistId))
        throw new ApiError(400, 'Provide a valid playlist ID');

      // 2. fetch playlist
      const playlist: playlistType = await Playlist.findById(playlistId);
      if (!playlist) throw new ApiError(500, 'Failed to fetch playlist.');

      // 3. return response
      res
        .status(200)
        .json(new ApiResponse(200, playlist, 'playlist fetched successfully.'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const addVideoToPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;
  }
);

export const removeVideoFromPlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
  }
);

export const deletePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    // TODO: delete playlist
    try {
      const { playlistId } = req.params;
      if (!playlistId || !Types.ObjectId.isValid(playlistId))
        throw new ApiError(400, 'Provide a valid video ID.');

      const deleted = await Playlist.findByIdAndDelete(playlistId);
      if (!deleted) throw new ApiError(404, 'Playlist not found');

      res.status(200).json(new ApiResponse(200, {}, 'deleted successfully'));
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);

export const updatePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    //TODO: update playlist
    try {
      // 1. get playlist Id
      const { playlistId } = req.params;
      if (!playlistId || !Types.ObjectId.isValid(playlistId))
        throw new ApiError(400, 'Provide a valid video ID.');

      // 2. get content to be updated
      const { name, description } = req.body;
      if (!name && !description)
        throw new ApiError(500, 'Provide at least one field to update');

      // 3. find and update playlist
      type fieldType = {
        name?: string;
        description?: string;
      };
      const updateFields: fieldType = {};
      if (name) {
        updateFields.name = name;
      }
      if (description) {
        updateFields.description = description;
      }
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        updateFields,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (!updatedPlaylist)
        throw new ApiError(500, 'Something went wrong while updating');

      // 4. return response
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedPlaylist,
            'playlist updated successfully.'
          )
        );
    } catch (error) {
      res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }
  }
);
