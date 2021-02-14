import { User, Upload } from "../models"
import { IField } from "../interfaces"

export const PageSection = {
  async owner({ owner }: IField) {
    try {
      const user = await User.findById(owner)
      return user
    } catch (error) {
      throw new Error(`Getting user to page section error: ${error.message}`)
    }
  },
  async uploads({ _id }: IField) {
    try {
      const uploads = await Upload.find({ content: _id })
      return uploads
    } catch (error) {
      throw new Error(`Getting uploads to page section error: ${error.message}`)
    }
  },
}
