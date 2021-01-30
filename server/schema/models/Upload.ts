import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  content: { type: Types.ObjectId, required: true },
  type: { type: String, enum: ["image", "news", "event"], required: true },
  key: { type: String, required: true },
})

export default model("Upload", schema)
