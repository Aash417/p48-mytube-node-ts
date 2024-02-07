import { Request, Response } from 'express';
import Playlist, { playlistType } from '../models/playlist.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { customRequest } from '../utils/helper';

export const createPlaylist = asyncHandler(
  async (req: customRequest, res: Response) => {
    try {
      const { name, description = '' }: playlistType = req.body;
      if (!name) throw new ApiError(400, 'A playlist name is required.');
      //TODO: create playlist

      const playlist: playlistType = await Playlist.create({
        name,
        description,
        owner: req.user._id,
      });
      if (!playlist) throw new ApiError(500, 'Failed to create playlist.');

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
    const { userId } = req.params;
    //TODO: get user playlists
  }
);

export const getPlaylistById = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id
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
    const { playlistId } = req.params;
    // TODO: delete playlist
  }
);

export const updatePlaylist = asyncHandler(
  async (req: Request, res: Response) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
  }
);
