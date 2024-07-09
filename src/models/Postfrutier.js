// this is my src/models/Postfrutier.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
    {
        userEmail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const PostFrutier = mongoose.models.PostFrutier || mongoose.model("PostFrutier", postSchema);
export default PostFrutier;

