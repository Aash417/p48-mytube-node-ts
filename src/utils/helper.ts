import { Request } from 'express';

export interface contentType {
  content: string;
}

export interface customRequest extends Request {
  user: { _id: string };
} // cookies options
export const options: {} = {
  httpOnly: true,
  secure: true,
};
