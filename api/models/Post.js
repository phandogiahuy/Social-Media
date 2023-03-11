import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    like: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
export const post = mongoose.model("post", PostSchema);
