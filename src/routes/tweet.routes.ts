import { isUserOwner } from './../middlewares/isTweetOwner.middleware';
import { Router } from 'express';
import {
  createTweet,
  deleteTweet,
  getTweet,
  getUserTweets,
  updateTweet,
} from '../controllers/tweet.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/').post(createTweet);
router.route('/user/:userId').get(getUserTweets);
router
  .route('/:tweetId')
  .get(getTweet)
  .patch(isUserOwner, updateTweet)
  .delete(isUserOwner, deleteTweet);

export default router;
