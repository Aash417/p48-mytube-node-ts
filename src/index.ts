import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import connectDB from './db/index';
import { app } from './app';

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log(`server is running at : ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(`mongo db error : ${err}`));
