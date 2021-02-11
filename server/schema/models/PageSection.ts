import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  page: { type: Types.ObjectId, ref: "Page", required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: Number, required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
})

export default model("PageSection", schema)
