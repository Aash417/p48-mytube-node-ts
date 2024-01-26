import { Request, Response } from 'express';
import { asyncHandler } from './../utils/asyncHandler';
import { User, userType } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { ApiResponse } from '../utils/ApiResponse';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  // 1. get user user data from frontend*******************************

  const { userName, fullName, email, password }: userType = req.body;
  // console.log(userName, email);

  // 2. validation*****************************************************
  if (
    [fullName, userName, email, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All field are required');
  }

  // 3. check if user already exists: username**************************
  const existedUser = User.findOne({ $or: [{ userName }, { email }] });
  console.log(existedUser);
  if (!existedUser)
    throw new ApiError(409, 'User with email & username already exits');

  // 4. check for images, check for avatar*******************************
  const avatarFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const avatarLocalPath = avatarFiles['avatar']
    ? avatarFiles['avatar'][0].path
    : undefined;
  const coverImageLocalPath = avatarFiles['coverImage']
    ? avatarFiles['coverImage'][0].path
    : undefined;

  if (!avatarLocalPath) throw new ApiError(400, 'Avatar file is required.');

  // 5. upload them to cloudinary, avatar**********************************
  const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
  const uploadedCoverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!uploadedAvatar) throw new ApiError(400, 'Avatar file is required.');

  // 6. create user object - create entry in DB****************************
  const user = await User.create({
    fullName,
    avatar: uploadedAvatar.url,
    coverImage: uploadedCoverImage?.url || '',
    userName: userName.toLowerCase(),
    email,
    password,
  });

  // 7. remove password and refresh token from response********************
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // 8. check for user creation********************************************
  if (!createdUser)
    throw new ApiError(500, 'Something went wrong while registering user.');

  // 9. return res
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'user registered successfully'));
});

export { registerUser };
