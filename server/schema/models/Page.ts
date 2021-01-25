import { SchemaDirectiveVisitor } from "apollo-server"
import { Schema, model } from "mongoose"

const schema = new Schema({
  url: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  imageKey: { type: String, default: "" },
  date: { type: Date, required: true },
})

export default model("Page", schema)
