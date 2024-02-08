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
  .get(getPlaylistById)
  .patch(isAuthenticated('playlist'), updatePlaylist)
  .delete(isAuthenticated('playlist'), deletePlaylist);

router
  .route('/add/:videoId/:playlistId')
  .patch(isAuthenticated('playlist'), addVideoToPlaylist);
router
  .route('/remove/:videoId/:playlistId')
  .patch(isAuthenticated('playlist'), removeVideoFromPlaylist);

router.route('/user/:userId').get(getUserPlaylists);

export default router;
