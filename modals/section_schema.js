import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["dsa", "theory"]
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Section", sectionSchema);