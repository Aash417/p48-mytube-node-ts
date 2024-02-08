import { Router } from 'express';
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from '../controllers/comment.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';

const router: Router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/:videoId').get(getVideoComments).post(addComment);

// router.use(isAuthenticated('comment'));
router
  .route('/c/:commentId')
  .patch(isAuthenticated('comment'), updateComment)
  .delete(isAuthenticated('comment'), deleteComment);

export default router;
