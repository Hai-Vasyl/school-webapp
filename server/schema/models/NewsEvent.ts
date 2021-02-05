import { Schema, model, Types } from "mongoose"

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["news", "event"], required: true },
  owner: { type: Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: [
      "ecology",
      "health",
      "sports",
      "science",
      "entertainment",
      "culture",
    ],
    required: true,
  },
  dateEvent: { type: Date, required: true },
})

export default model("NewsEvent", schema)
