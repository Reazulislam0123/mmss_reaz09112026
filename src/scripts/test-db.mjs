import mongoose from "mongoose";

const uri = "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

console.log("Connecting to MongoDB Atlas...");

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log("✅ Successfully connected to MongoDB Atlas (cluster0.zqern1c.mongodb.net)!");
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Existing collections:", collections.map(c => c.name));

  await mongoose.disconnect();
  console.log("Connection closed successfully.");
} catch (error) {
  console.error("❌ MongoDB Atlas Connection Error:", error.message);
  process.exit(1);
}

