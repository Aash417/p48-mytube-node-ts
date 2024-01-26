import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from './../controllers/user.controller';
import { upload } from './../middlewares/multer.middleware';
import { verifyJWT } from './../middlewares/auth.middleware';

const router: Router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);

router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/change-password').patch(verifyJWT, changeCurrentPassword);
router.route('/update-user').patch(verifyJWT, updateAccountDetails);
router
  .route('/update-avatar')
  .patch(upload.single('avatar'), verifyJWT, updateUserAvatar);
router
  .route('/update-coverImage')
  .patch(upload.single('coverImage'), verifyJWT, updateUserCoverImage);

export default router;
