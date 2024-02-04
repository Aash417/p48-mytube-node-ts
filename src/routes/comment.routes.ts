import { Router } from 'express';
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from '../controllers/comment.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/:videoId').get(getVideoComments).post(addComment);
router.route('/c/:commentId').delete(deleteComment).patch(updateComment);

export default router;