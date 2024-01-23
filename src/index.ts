import 'dotenv/config';

import connectDB from './db/index';
import { app } from './app';

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at : ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(`mongo db error : ${err}`));