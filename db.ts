import mongoose from "mongoose";

const connectDB = () => {
  // @ts-ignore
  mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
