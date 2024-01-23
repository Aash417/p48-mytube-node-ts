import mongoose, { Mongoose } from 'mongoose';
import DB from '../constants';

const connectDB = async () => {
  try {
    const conn: Mongoose = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB}`
    );

    console.log(`Database is connected at : ${conn.connection.host}`);
  } catch (error) {
    console.log('mongo connection error: ', error);
    process.exit(1);
  }
};

export default connectDB;
