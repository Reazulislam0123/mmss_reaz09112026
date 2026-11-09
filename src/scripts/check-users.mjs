import mongoose from "mongoose";

const uri = "mongodb+srv://MMS_Reez:2ljIqqWU17KYH2ha@cluster0.zqern1c.mongodb.net/smart_mms?retryWrites=true&w=majority";

await mongoose.connect(uri);
const users = await mongoose.connection.db.collection("users").find({}).toArray();
console.log("Current MongoDB Users:", users.map(u => ({ email: u.email, name: u.fullName, houseId: u.houseId, role: u.role, uid: u.firebaseUid })));

const houses = await mongoose.connection.db.collection("houses").find({}).toArray();
console.log("Current MongoDB Houses:", houses.map(h => ({ id: h.houseId, name: h.name, code: h.joinCode })));

await mongoose.disconnect();
