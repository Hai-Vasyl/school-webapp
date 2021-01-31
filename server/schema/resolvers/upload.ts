import { User } from "../models"
import { IField } from "../interfaces"

export const UploadFile = {
  async owner({ owner }: IField) {
    try {
      const user = await User.findById(owner)
      return user
    } catch (error) {
      throw new Error(`Getting owner to upload error: ${error.message}`)
    }
  },
}
