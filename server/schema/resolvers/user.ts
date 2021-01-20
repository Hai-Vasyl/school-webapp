import { Group } from "../models"
import { IField } from "../interfaces"

export const User = {
  async group({ group }: IField) {
    try {
      const gr = await Group.findById(group)
      return gr
    } catch (error) {
      throw new Error(`Getting group to user error: ${error.message}`)
    }
  },
}
