import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },
  description: { type: String, default: "" },
  date: { type: Date, required: true },
})

export default model("Image", schema)
