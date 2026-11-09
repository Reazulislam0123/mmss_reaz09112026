import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

async function fixDuplicateManager() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // Set Khalid Hossain as member
  await db.collection("users").updateOne(
    { email: "shadkhalid56@gmail.com" },
    { $set: { role: "member" } }
  );

  // Set Reazul Islam as manager
  await db.collection("users").updateOne(
    { email: "reazul.islam6164@gmail.com" },
    { $set: { role: "manager" } }
  );

  // Ensure house document points to Reazul Islam
  const reazulUser = await db.collection("users").findOne({ email: "reazul.islam6164@gmail.com" });
  if (reazulUser) {
    await db.collection("houses").updateOne(
      { houseId: "HOUSE_DHAKA_01" },
      { $set: { managerFirebaseUid: reazulUser.firebaseUid } }
    );
  }

  const users = await db.collection("users").find({}).toArray();
  console.log("Updated users in Atlas:");
  users.forEach((u) => console.log(` - ${u.fullName} (${u.email}): role=${u.role}`));

  await mongoose.disconnect();
}

fixDuplicateManager().catch(console.error);
