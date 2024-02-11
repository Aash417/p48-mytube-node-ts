import { Router } from 'express';
import { getLikedVideos, toggleLike } from '../controllers/like.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router.route('/toggle/v/:videoId').post(toggleVideoLike);
// router.route('/toggle/c/:commentId').post(toggleCommentLike);
// router.route('/toggle/t/:tweetId').post(toggleTweetLike);
router.route('/toggle/t/:tweetId').post(toggleLike('tweet'));
router.route('/toggle/v/:tweetId').post(toggleLike('video'));
router.route('/toggle/c/:tweetId').post(toggleLike('comment'));

router.route('/videos').get(getLikedVideos);

export default router;
