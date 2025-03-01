import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error" + error);
  }
};

export default dbConnection;
