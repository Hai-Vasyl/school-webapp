import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, default: "" },
  date: { type: Date, required: true },
})

export default model("Group", schema)
