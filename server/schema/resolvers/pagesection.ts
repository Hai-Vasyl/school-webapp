import { User } from "../models"
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
}
