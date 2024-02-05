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
import { upload } from '../middlewares/multer.middleware';
import { isUserOwner } from './../middlewares/owner.middleware';

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
  .delete(isUserOwner, deleteVideo)
  .patch(isUserOwner, upload.single('thumbnail'), updateVideo);

router
  .route('/toggle/publish/:videoId')
  .patch(isUserOwner, togglePublishStatus);

export default router;
