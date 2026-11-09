import mongoose from "mongoose";

const uri = "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

await mongoose.connect(uri);
const db = mongoose.connection.db;

// Remove mock users with @smartmms.bd
const delRes = await db.collection("users").deleteMany({
  email: { $regex: /@smartmms\.bd$/i }
});
console.log("Deleted mock users:", delRes.deletedCount);

// Clean dummy bazaars and deposits that belonged to mock UIDs
await db.collection("bazaars").deleteMany({
  paidByUid: { $in: ["UID_ADMIN_01", "UID_MEMBER_02", "UID_MEMBER_03", "UID_MEMBER_04"] }
});
await db.collection("deposits").deleteMany({
  firebaseUid: { $in: ["UID_ADMIN_01", "UID_MEMBER_02", "UID_MEMBER_03", "UID_MEMBER_04"] }
});
await db.collection("meals").deleteMany({
  firebaseUid: { $in: ["UID_ADMIN_01", "UID_MEMBER_02", "UID_MEMBER_03", "UID_MEMBER_04"] }
});

// Set ANM Reazul Islam as manager of the house
const reazulUser = await db.collection("users").findOne({
  email: "reazul.islam6164@gmail.com"
});

if (reazulUser) {
  await db.collection("users").updateOne(
    { email: "reazul.islam6164@gmail.com" },
    { $set: { role: "manager" } }
  );

  await db.collection("houses").updateOne(
    { houseId: "HOUSE_DHAKA_01" },
    {
      $set: {
        managerFirebaseUid: reazulUser.firebaseUid,
        dutyManagerUid: reazulUser.firebaseUid,
      }
    }
  );
  console.log("Updated Reazul Islam as manager of HOUSE_DHAKA_01");
}

const remainingUsers = await db.collection("users").find({}).toArray();
console.log("Cleaned Users:", remainingUsers.map(u => ({ email: u.email, name: u.fullName, role: u.role, houseId: u.houseId })));

await mongoose.disconnect();
