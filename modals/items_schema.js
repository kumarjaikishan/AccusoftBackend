import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
  label: {
    type: String,
    trim: true
  },
  code: {
    type: String,
    trim: true
  }
});

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy"
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    answer: {
      type: String,
      default: ""
    },

    solutions: {
      type: [solutionSchema],
      default: []
    },

    type: {
      type: String,
      enum: ["dsa", "theory"],
      default: "dsa"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Item", itemSchema);