import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from './comment.controller';
import { getChannelStats, getChannelVideos } from './dashboard.controller';
import { healthcheck } from './healthcheck.controller';
import { getLikedVideos, toggleLike } from './like.controller';
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from './playlist.controller';
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
} from './subscription.controller';
import {
  createTweet,
  deleteTweet,
  getTweet,
  getUserTweets,
  updateTweet,
} from './tweet.controller';
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from './user.controller';
import {
  publishAVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from './video.controller';

export {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
  getChannelStats,
  getChannelVideos,
  healthcheck,
  getLikedVideos,
  toggleLike,
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
  getSubscribedChannels,
  getUserChannelSubscribers,
  createTweet,
  deleteTweet,
  getTweet,
  getUserTweets,
  updateTweet,
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  publishAVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
