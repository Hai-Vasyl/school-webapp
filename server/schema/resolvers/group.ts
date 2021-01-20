import { User } from "../models"
import { IField } from "../interfaces"

export const Group = {
  async owner({ owner }: IField) {
    try {
      const user = await User.findById(owner)
      return user
    } catch (error) {
      throw new Error(`Getting user to group error: ${error.message}`)
    }
  },
}
