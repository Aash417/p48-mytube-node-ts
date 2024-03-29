import { Router } from 'express';
import {
  getChannelStats,
  getChannelVideos,
} from '../controllers/dashboard.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/stats/:channelId').get(getChannelStats);
router.route('/videos/:channelId').get(getChannelVideos);

export default router;
