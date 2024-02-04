import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck.controller';

const router: Router = Router();

router.route('/').get(healthcheck);

export default router;
