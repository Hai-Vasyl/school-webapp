import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  content: { type: Types.ObjectId },
  type: {
    type: String,
    enum: ["image", "news", "event", "other", "private"],
    required: true,
  },
  key: { type: String, default: "" },
  description: { type: String, default: "" },
  hashtags: { type: String, default: "" },
  format: { type: String, enum: ["image", "file"], default: "image" },
})

export default model("Upload", schema)
