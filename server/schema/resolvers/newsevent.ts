import { User, ExtraLink } from "../models"
import { IField } from "../interfaces"

export const NewsEvent = {
  async owner({ owner }: IField) {
    try {
      const user = await User.findById(owner)
      return user
    } catch (error) {
      throw new Error(`Getting user to news or event error: ${error.message}`)
    }
  },
  async links({ _id }: IField) {
    try {
      const links = await ExtraLink.find({ content: _id })
      return links
    } catch (error) {
      throw new Error(
        `Getting extra links to news or event error: ${error.message}`
      )
    }
  },
}
