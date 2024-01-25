import 'dotenv/config';

import connectDB from './db/index';
import { app } from './app';

connectDB()
  .then(() => {
    app.listen(4000, () => {
      console.log(`server is running at : 4000`);
    });
  })
  .catch((err) => console.log(`mongo db error : ${err}`));