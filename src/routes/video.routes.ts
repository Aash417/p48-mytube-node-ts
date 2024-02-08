import { Router } from 'express';
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from '../controllers/video.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';

import { upload } from '../middlewares/multer.middleware';

const router: Router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route('/')
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: 'videoFile',
        maxCount: 1,
      },
      {
        name: 'thumbnail',
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router
  .route('/:videoId')
  .get(getVideoById)
  .delete(isAuthenticated('video'), deleteVideo)
  .patch(isAuthenticated('video'), upload.single('thumbnail'), updateVideo);

router
  .route('/toggle/publish/:videoId')
  .patch(isAuthenticated('video'), togglePublishStatus);

export default router;
