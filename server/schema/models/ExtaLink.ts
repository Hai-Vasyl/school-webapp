import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  link: { type: String, required: true },
  label: { type: String, required: true },
  content: { type: Types.ObjectId, ref: "NewsEvent", required: true },
  date: { type: Date, required: true },
})

export default model("ExtraLink", schema)
