// This is my src/models/User.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        nickname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 128,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        allergy: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
