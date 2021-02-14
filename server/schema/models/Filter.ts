import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  page: { type: Types.ObjectId, ref: "Page", required: true },
  url: { type: String, required: true },
  section: { type: Types.ObjectId, ref: "PageSection", required: true },
  keyWord: { type: String, required: true },
  value: { type: String, required: true },
  date: { type: Date, required: true },
})

export default model("Filter", schema)
