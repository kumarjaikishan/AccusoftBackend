import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// prevent duplicate categories for same user
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);