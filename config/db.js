import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("DB disconnected");
    process.exit(0);
  } catch (err) {
    console.log("Error closing DB:", err.message);
    process.exit(1);
  }
});
