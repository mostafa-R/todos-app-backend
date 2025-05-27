import mongoose from "mongoose";
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "done"],
    },
    tags: {
      type: [],
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Todo", todoSchema);
