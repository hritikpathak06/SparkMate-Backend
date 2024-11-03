import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    genderPreference: {
        type: String,
        required: true,
        enum: ["male", "female", "both"],
    },
    bio: { type: String, required: true },
    image: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
});
// Compare password
userSchema.methods.matchPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
