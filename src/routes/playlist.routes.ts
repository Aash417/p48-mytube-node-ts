import { Router } from 'express';
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from '../controllers/playlist.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';

const router: Router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/').post(createPlaylist);

router
  .route('/:playlistId')
  .get(isAuthenticated('playlist'), getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist);
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist);

router.route('/user/:userId').get(getUserPlaylists);

export default router;
